import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';


export class MyJar extends THREE.Group {

    constructor() {
        super();

        this.jarMesh = null;
        this.jarMeshSize = 1.0;

        this.samplesU = 10;
        this.samplesV = 10;

        this.map = null;
        this.material = null;
        this.meshes = [];

        this.buildJar();

    }

    buildJarSurface(){
        this.map = new THREE.TextureLoader().load('textures/jar_texture.jpg');

        this.material = new THREE.MeshLambertMaterial({ map: this.map, side: THREE.DoubleSide, transparent: true, opacity: 0.90 });

        // declare local variables

        let controlPoints;

        let surfaceData;

        let orderU = 3

        let orderV = 2

        // build nurb #1
        controlPoints = [ 
            // U = 0
                [ // V = ​​0..2
                    [ -0.2, 0, 0, 1 ],
                    [ 0,  0.3, 0, 1 ],
                    [ 0.2, 0, 0, 1 ]
                ],

            // U = 1
                [ // V = ​​0..2
                    [ -0.2, 0, 0.2, 1 ],
                    [ 0, 0.2, 0.2, 1 ],
                    [ 0.2, 0, 0.2, 1 ]
                ],

            // U = 2
                [ // V = ​​0..2
                    [ -0.2, 0, 0.4, 1 ],
                    [ 0,  0.1, 0.4, 1 ],
                    [ 0.2, 0, 0.4, 1 ]
                ],
            
            // U = 3
                [ // v = 0..2
                    [ -0.1, 0, 0.6, 1 ],
                    [ 0,  0.1, 0.6, 1 ],
                    [ 0.1, 0, 0.6, 1 ]
                ]
        ]

        surfaceData = this.build(controlPoints,

            orderU, orderV, this.samplesU,

            this.samplesV, this.material)

        const mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0

        mesh.rotation.y = 0

        mesh.rotation.z = 0

        mesh.scale.set(this.jarMeshSize, this.jarMeshSize, this.jarMeshSize);

        mesh.position.set(1.2, 0, 2.2);

        return mesh
    }


    // Build the jar mesh with the curve surfaces
    buildJar() {

        let mesh1 = this.buildJarSurface();
        let mesh2 = this.buildJarSurface();
        mesh1.castShadow = true;
        mesh2.castShadow = true;
        mesh1.receiveShadow = true;
        mesh2.receiveShadow = true;

        mesh2.rotation.z = Math.PI;

        this.add(mesh1);
        this.add(mesh2);

        this.rotation.x = -Math.PI / 2;
    }

    build(controlPoints, degree1, degree2, samples1, samples2, material) {
        const knots1 = []
        const knots2 = []

        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
        for (var i = 0; i <= degree1; i++) {
            knots1.push(0)
        }

        for (var i = 0; i <= degree1; i++) {
            knots1.push(1)
        }

        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
        for (var i = 0; i <= degree2; i++) {
            knots2.push(0)
        }

        for (var i = 0; i <= degree2; i++) {
            knots2.push(1)
        }

        let stackedPoints = []

        for (var i = 0; i < controlPoints.length; i++) {

            let row = controlPoints[i]
            let newRow = []

            for (var j = 0; j < row.length; j++) {
                let item = row[j]
                newRow.push(new THREE.Vector4(item[0],
                    item[1], item[2], item[3]));
            }

            stackedPoints[i] = newRow;
        }

        const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, stackedPoints);
        const geometry = new ParametricGeometry(getSurfacePoint, samples1, samples2);

        return geometry;

        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }
    }

    /**
    * updates the contents
    * this method is called from the render method of the app
    * 
    */
    update() {
    }
}