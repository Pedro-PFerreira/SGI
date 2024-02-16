import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class loads the objects;
 **/
export class MyObjectsLoader{
    constructor(app, data, mats){
        this.app = app;
        this.data = data.nodes["scene"];
        this.lodData = data["lods"]
        this.mats = mats;

        this.loadDistances = {};

    } 

    /**
     * Loads objects from the scene graph
     * Each primitive will use the respective loader.
     * @returns {Array} objects
     */
    loadObjects(){
        let mat;
        if(this.data.materialIds !== undefined && this.data.materialIds.length > 0){
            mat = this.mats[this.data.materialIds[0]];
        }

        return this.loadObjectsAux(this.data, mat);
    }

    /**
     * Auxiliar method that deals with the lods, primitives and lights
     * @param {*} data 
     * @param {*} mat 
     * @returns 
     */
    loadObjectsAux(data, mat){
        const group = new THREE.Group();
        group.name = data.id;

        group.castShadow = data.castshadows;
        group.receiveShadow = data.receiveshadows;

        if(data.children.some(child => child.type === "lod")){
            const lod = this.makeLOD(
                data.children.find(child => child.type !== "lod"),
                data.children.find(child => child.type === "lod").children,
                mat);
            group.add(lod);
            return group;
        }

        for(let i = 0; i < data.children.length; i++){
            const child = data.children[i];
            let childMat = mat;

            if(child.materialIds !== undefined && child.materialIds.length > 0)
                childMat = this.mats[child.materialIds[0]];

            if(child.type == "node"){
                group.name = child.id;
                let obj = this.loadObjectsAux(child, childMat);
                this.transformObject(obj, child.transformations);
                group.add(obj);
            }

            else if(child.type == "primitive"){
                group.add(this.loadPrimitive(child, childMat));
            }

            else if(child.id.includes("light")){
                group.add(this.loadLight(child, false))
            }
        }
        
        return group;
    }

    /**
     * Creates a LOD for the respective object
     */
    makeLOD(data, lodData, mat) {
        const lod = new THREE.LOD();
        const mesh = data.type === "node"
            ? this.loadObjectsAux(data, mat)
            : this.loadPrimitive(data, mat)
        lod.addLevel(mesh, 0);

        lodData.forEach(
            lodNode => lod.addLevel(
                lodNode.node.type === "node"
                    ? this.loadObjectsAux(lodNode.node, mat)
                    : this.loadPrimitive(lodNode.node, mat)
                , lodNode.mindist
            )
        );

        return lod;
    }  

    /**
     * Applies the transformations to the given object
     * @param {*} object 
     * @param {*} data 
     * @returns 
     */
    transformObject(object, data){
        for(let i = 0; i < data.length; i++){
            const transf = data[i];
            if(transf.type == "T")
                object.position.set(object.position.x + transf.translate[0], object.position.y + transf.translate[1], object.position.z + transf.translate[2]);
            else if(transf.type == "R")
                object.rotation.set(
                    object.rotation.x + THREE.MathUtils.degToRad(transf.rotation[0]),
                    object.rotation.y + THREE.MathUtils.degToRad(transf.rotation[1]),
                    object.rotation.z + THREE.MathUtils.degToRad(transf.rotation[2])
                );
            else if(transf.type == "S")
                object.scale.set(object.scale.x * transf.scale[0], object.scale.y * transf.scale[1], object.scale.z * transf.scale[2]);
        }

        object.updateMatrix()

        return object;
    }

    /**
     * Loads lights from the scene graph, according to its type
     * @param {*} data 
     * @param {*} helpers 
     * @returns 
     */
    loadLight(data, helpers){
        let light_obj;
        let light_helper;

        switch(data.type){
            case "pointlight":
                light_obj = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
                light_helper = new THREE.PointLightHelper(light_obj, 1);
                break;
            
            case "spotlight":
                light_obj = new THREE.SpotLight(data.color, data.intensity,
                    data.distance, data.angle, data.penumbra,
                    data.decay                   
                );
                light_obj.target.position.set(data.target);
                light_helper = new THREE.SpotLightHelper(light_obj, 1);
                break;

            case "directionallight":
                light_obj = new THREE.DirectionalLight(data.color, data.intensity);
                light_helper = new THREE.DirectionalLightHelper(light_obj, 1);
                break;

            default:
                break;
        }

        if(light_obj == undefined || light_obj == null)
            return;

        light_obj.castShadow = data.castshadow;

        if(data.position != undefined && data.position != null)
            light_obj.position.set(data.position[0], data.position[1], data.position[2])

        if(helpers)
            this.app.scene.add(light_helper);

        return light_obj;
    }

    /**
     * loads the primitive from the scene graph, according to its type
     * @param {*} data 
     * @param {*} mat 
     * @returns 
     */
    loadPrimitive(data, mat){
        let primitive;

        switch(data.subtype){
            case "rectangle":
                primitive = this.loadRectangle(data.representations[0], mat);
                break;
            case "triangle":
                primitive = this.loadTriangle(data.representations[0], mat);
                break;
            case "cylinder":
                primitive = this.loadCylinder(data.representations[0], mat);
                break;
            case "sphere":
                primitive = this.loadSphere(data.representations[0], mat);
                break;
            case "box":
                primitive = this.loadBox(data.representations[0], mat);
                break;   
            case "nurbs":
                primitive = this.loadNurbs(data.representations[0], mat);
                break;
            case "polygon":
                primitive = this.loadPolygon(data.representations[0], mat);
                break;
            default:
                console.error("Unknown primitive type: " + data.subtype);
                break;
        }

        if (primitive !== undefined){
            primitive.castShadow = true;
            primitive.receiveShadow = true;

            if( data.transformations !== undefined && data.transformations !== null )
                return this.transformObject(primitive, data.transformations);

            return primitive;
        }
    }

    loadRectangle(data, mat){
        const width = data.xy2[0] - data.xy1[0];
        const height = data.xy2[1] - data.xy1[1];

        const geometry = new THREE.PlaneGeometry(
            width,
            height,
            data.parts_x,
            data.parts_y
        );

        const material = mat || new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(data.xy1[0] + width/2, data.xy1[1] + height/2, 0);

        return mesh;
    }

    /**
     * Creates a triangle with the given data
     */ 
    loadTriangle(data, mat){
        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(data.xyz1[0], data.xyz1[1], data.xyz1[2]),
            new THREE.Vector3(data.xyz2[0], data.xyz2[1], data.xyz2[2]),
            new THREE.Vector3(data.xyz3[0], data.xyz3[1], data.xyz3[2])
        );

        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.computeFaceNormals();

        const material = mat || new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * Creates a cylinder with the given data
     */ 
    loadCylinder(data, mat){
        const geometry = new THREE.CylinderGeometry(
            data.top,
            data.base,
            data.height,
            data.slices,
            data.stacks,
            data.capsclose,
            data.thetastart,
            data.thetalength
        );

        const material = mat || new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * Creates a sphere with the given data
     */ 
    loadSphere(data, mat){
        const geometry = new THREE.SphereGeometry(
            data.radius,
            data.slices,
            data.stacks,
            data.phistart,
            data.philength,
            data.thetastart,
            data.thetalength
        );

        const material = mat || new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    /**
     * Creates a box with the given data
     */ 
    loadBox(data, mat){
        const width = data.xyz2[0] - data.xyz1[0];
        const height = data.xyz2[1] - data.xyz1[1];
        const depth = data.xyz2[2] - data.xyz1[2];

        const geometry = new THREE.BoxGeometry(
            width,
            height,
            depth,
            data.parts_x || 1,
            data.parts_y || 1,
            data.parts_z || 1
        );

        const material = mat || new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * Creates a nurbs surface with the given data
     */ 
    loadNurbs(data, mat){
        const controlPoints = [];

        for(let u = 0; u <= data.degree_u; u++){
            const array1 = [];

            for(let v = 0; v <= data.degree_v; v++){
                const controlPoint = data.controlpoints[u * data.degree_v + v];
                array1.push([controlPoint.xx, controlPoint.yy, controlPoint.zz]);
            }

            controlPoints.push(array1);
        }

        const nurbs = new MyNurbsBuilder().build(controlPoints, data.degree_u, data.degree_v, data.parts_u, data.parts_v, mat);
        const material = mat || new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(nurbs, material);
        return mesh;
    }

    /**
     * loads polygon with the given data, using the buffer geometry
     * @param {*} data 
     * @param {*} mat 
     * @returns 
     */
    loadPolygon(data, mat){
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const vertexColors = [];
        const indices = [];
        const normals = [];
        const stackLength = data.radius / data.stacks;
        const sliceAngle = 2 * Math.PI / data.slices;

        vertices.push(0.0, 0.0, 0.0);
        normals.push(0.0, 0.0, 1.0);
        vertexColors.push(...data.color_c.toArray());
        
        
        for(let i = 0; i < data.slices; i++){
            vertices.push(
                stackLength * Math.cos(i * sliceAngle),
                stackLength * Math.sin(i * sliceAngle),
                0.0
            );

            indices.push(
                0,
                i + 1,
                ((i + 1) % (data.slices)) + 1
            );
            vertexColors.push(...data.color_c.clone().lerp(data.color_p, 1 / data.stacks).toArray());
        }

        for(let st = 2; st <= data.stacks; st++){
            for(let sl = 0; sl < data.slices; sl++){
                vertices.push(
                    st * stackLength * Math.cos(sl * sliceAngle),
                    st * stackLength * Math.sin(sl * sliceAngle),
                    0.0
                );

                indices.push(
                    (st - 1) * data.slices + sl + 1,
                    (st - 2) * data.slices + ((sl + 1) % data.slices) + 1,
                    (st - 2) * data.slices + sl + 1,

                    (st - 1) * data.slices + sl + 1,
                    (st - 1) * data.slices + ((sl + 1) % data.slices) + 1,
                    (st - 2) * data.slices + ((sl + 1) % data.slices) + 1,
                )

                vertexColors.push(...data.color_c.clone().lerp(data.color_p, st / data.stacks).toArray());
                normals.push(0.0, 0.0, 1.0);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));
        geometry.setIndex(indices);

        const material = mat || new THREE.MeshBasicMaterial({vertexColors: true});
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
}