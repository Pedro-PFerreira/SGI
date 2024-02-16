import * as THREE from 'three';

/**
 * This class loads the materials;
 **/
export class MyMaterialsLoader{
    constructor(data, textures){
        this.data = data;
        this.materials = {};
        this.textures = textures;
    }

    /**
     * Loads materials from the scene graph
     * @returns {Array} materials
     */
    loadMaterials(){
        const data = this.data;

        console.log("[Loading Materials]")
        for (var mat in data) {

            console.log("Loading material: ", mat);
            let material = data[mat];

            let material_obj = new THREE.MeshPhongMaterial({
                color: material.color,
                specular: material.specular,
                emissive: material.emissive,
                shininess: material.shininess,
                wireframe: material.wireframe,
                flatShading: material.shading == "flat",                
                bumpMap: material.bump_ref || null,
                bumpScale: material.bump_ref || 1,
            });

            // Sets the shading
            if (material.shading != undefined && material.shading != null)
                material_obj.shading = material_obj == "flat" ? THREE.flatShading : THREE.smoothShading

            // Sets the double sided, if defined in the respective node of the scene graph
            if(material.twosided != undefined && material.twosided != null)
                material_obj.side = material.twosided ? THREE.DoubleSide : THREE.FrontSide;
            
            // Sets the texture, if defined in the respective node of the scene graph
            if(material.textureref != undefined && material.textureref != null){
                const texture = this.textures[material.textureref];
                texture.repeat.set(material.texlength_s, material.texlength_t);
                texture.needsUpdate = true;
                material_obj.map = texture;
            }
            
            this.materials[mat] = material_obj;
        }

        return this.materials;
    }
}