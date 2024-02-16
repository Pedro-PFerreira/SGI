import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

export class MyNewspaper extends THREE.Mesh{

    constructor(app) {
        const nurbsBuilder = new MyNurbsBuilder(app);
        const texture = new THREE.TextureLoader().load( 'textures/newspaper.jpg' );
        texture.rotation = Math.PI / 2;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshPhongMaterial({ color: "#ffffff",
        specular: "#000000", emissive: "#000000", shininess: 90, map: texture });
        material.side = THREE.DoubleSide;
        let samplesU = 2;
        let samplesV = 10;
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 1
        let orderV = 3
        
        // build nurb #2
        controlPoints=
        [
            [
                [ -0.4, 0.3, -0.75, 1 ],
                [ -0.325, 0, -0.75, 1 ],
                [ 0.325, 0, -0.75, 1 ],
                [ 0.4, 0.3, -0.75, 1 ]
            ],

            [
                [ -0.4, 0.3, 0.75, 1 ],
                [ -0.325, 0, 0.75, 1 ],
                [ 0.325, 0, 0.75, 1 ],
                [ 0.4, 0.3, 0.75, 1 ]
            ],

        ]

        surfaceData = nurbsBuilder.build(controlPoints, orderU, orderV, samplesU, samplesV, material)  
        super( surfaceData, material );
     }
}