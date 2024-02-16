import * as THREE from 'three';

export class MyGlassPane extends THREE.Mesh{

    constructor(width, height) {
        // Make a glass pane
        const glassPaneGeometry = new THREE.BoxGeometry( width, height, 0.05 );
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0.05,
            transmission: 0.95,
            reflectivity: 0.2,
        });

        super(glassPaneGeometry, glassMaterial);
    }
}