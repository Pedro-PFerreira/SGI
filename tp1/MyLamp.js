import * as THREE from 'three';

export class MyLamp extends THREE.Group {

    constructor(){

        super();
        this.cable = null;
        this.lamp = null;
        this.lamp_shade = null;
        this.lamp_shade_top = null;

        this.buildCable();
        this.buildShade();
        this.buildLamp();
    }

    // Builds lamp's cable
    buildCable(){

        const points = [
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(0, 9.8, 0),
            new THREE.Vector3(0, 9.5, 0),
        ];

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeSegments = 32;
        const radius = 0.05;
        const radialSegments = 8;
        const closed = false;

        const cableGeometry = new THREE.TubeGeometry(curve, tubeSegments, radius, radialSegments, closed);

        const cableMaterial = new THREE.MeshLambertMaterial({ color: "#000000" });

        this.cable = new THREE.Mesh(cableGeometry, cableMaterial);

        this.add(this.cable);
    }

    // Builds lamp's shade
    buildShade(){

        const lamptopGeometry = new THREE.CircleGeometry(0.2, 22);
        const lamptopMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });
        lamptopMaterial.side = THREE.DoubleSide;

        this.lamp_shade_top = new THREE.Mesh(lamptopGeometry, lamptopMaterial);
        this.lamp_shade_top.rotation.x = Math.PI/2;
        this.lamp_shade_top.position.y = 9.5;
            
        const lampGeometry = new THREE.CylinderGeometry(0.2, 0.9,1, 22, 1, true, 0, 2 * Math.PI);
        const lampMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });
        lampMaterial.side = THREE.DoubleSide;

        this.lamp_shade = new THREE.Mesh(lampGeometry, lampMaterial);

        this.lamp_shade.position.y = 9;

        this.add(this.lamp_shade_top);
        this.add(this.lamp_shade);
    }

    // Builds lamp itself
    buildLamp(){
        const lampGeometry = new THREE.SphereGeometry(0.35, 22, 22);
        const lampMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFED",
        emissive: "#FFFFED", shininess: 100});

        this.lamp = new THREE.Mesh(lampGeometry, lampMaterial);

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 0.5, 0, 0 );
        pointLight.position.set( 0, 9, 0 );
        pointLight.castShadow = true;
        

        this.lamp.position.y = 9.1;
        this.add(this.lamp);
        this.add( pointLight );
    }

}