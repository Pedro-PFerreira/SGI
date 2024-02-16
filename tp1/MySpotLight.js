import * as THREE from 'three';

export class MySpotLight extends THREE.Group {

    constructor() {
        super();

        this.buildSpotLight();
        this.buildShade();

    }

    buildSpotLight(){
        const spotLight = new THREE.SpotLight(0xffffff, 10);
        spotLight.castShadow = true;
        spotLight.position.set(-4.6, 0.5, -4.6);
        this.add(spotLight);
    }

    buildShade(){
        const geometry = new THREE.ConeGeometry( 0.5, 1, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        const cone = new THREE.Mesh( geometry, material );
        cone.castShadow = true;
        cone.position.set(-4.45, 0.5, -4.45);
        cone.rotation.x = Math.PI/2;
        cone.rotation.z = 3* Math.PI/4;
        this.add(cone);
    }
    



}