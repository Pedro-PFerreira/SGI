import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export class MyFlower extends THREE.Group {

    constructor() {
        super();

        this.numberPetals = 8;
        this.numberOfSamples = 160;

        this.map = null;
        this.petalSize = 0.25;
        this.petalMaterial = null;

        this.samplesU = 16;
        this.samplesV = 16;

        this.centralCircleMaterial = null;

        this.meshes = [];

        this.buildFlower();

    }

    buildStem(){

        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0.1, 1, 0),
            new THREE.Vector3(0, 1.5, 0),
            new THREE.Vector3(-0.1, 2, 0),
            new THREE.Vector3(0, 3.3, 0),
        ];
        
        const curve = new THREE.CatmullRomCurve3(points);

        const tubeSegments = 64;
        const radius = 0.05;
        const radialSegments = 8;
        const closed = false;

        const stemGeometry = new THREE.TubeGeometry(curve, tubeSegments, radius, radialSegments, closed);

        const stemMaterial = new THREE.MeshLambertMaterial({ color: "#013220" });

        const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);

        stemMesh.rotation.z = Math.PI;
        stemMesh.position.set(0,1.3,-0.04);
        stemMesh.scale.set(0.3,0.3,0.3);

    
        this.add(stemMesh);

    }

    buildPetal(){
        // creation of one petal

        this.map = new THREE.TextureLoader().load('textures/petal_texture.jpg');

        this.material = new THREE.MeshLambertMaterial({ map: this.map,
             side: THREE.DoubleSide });

        // declare local variables

        let controlPoints;

        let surfaceData;

        let orderU = 1;

        let orderV = 2;

        controlPoints = [ 
            // U = 0
                [ // V = ​​0..2;
                    [0, 0, 0, 1],
                    [-0.5, 0.5, 0.0, 1 ],
                    [ 0, 1, 1, 1 ]
                ],

            // U = 1
                [ // V = ​​0..2;
                    [0, 0, 0, 1],
                    [0.5, 0.5, 0.0, 1 ],
                    [ 0, 1, 1, 1 ]
                ]
        ];

        surfaceData = this.build(controlPoints,

            orderU, orderV, this.samplesU,

            this.samplesV, this.material);

        const petalMesh = new THREE.Mesh(surfaceData, this.material);

        petalMesh.scale.set(this.petalSize, this.petalSize, this.petalSize);

        petalMesh.position.set(0, 0, 0);

        return petalMesh;
    }

    
    buildPetals(){

        // creation of the central circle

        this.centralCircle = new THREE.CircleGeometry( 0.1, 32 );

        this.centralCircleMaterial = new THREE.MeshLambertMaterial( { color: "#ffff00"} );
        this.centralCircleMaterial.side = THREE.DoubleSide;

        this.centralCircleMesh = new THREE.Mesh( this.centralCircle, this.centralCircleMaterial );

        this.centralCircleMesh.position.set(0,1.3,0);

        // creation of the petals

        let angle = 0;

        let angleIncrement = 2*Math.PI/this.numberPetals;

        for(let i = 0; i < this.numberPetals; i++){
                
            let petal = this.buildPetal();

            petal.add(this.centralCircleMesh);

            petal.rotation.z = angle;

            petal.position.set(0,1.3,-0.05);

            this.add(petal);

            angle += angleIncrement;
        }
            
        this.add(this.centralCircleMesh);
    }


    buildFlower(){
        this.buildPetal();
        this.buildPetals();
        this.buildStem();
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

}    