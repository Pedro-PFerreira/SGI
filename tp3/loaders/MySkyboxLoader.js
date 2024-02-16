import * as THREE from 'three';
import { MyTexturesLoader } from './MyTexturesLoader.js';

/**
 * This class loads the shadows (fog);
 */
export class MySkyboxLoader{

    constructor(data){
        this.data = data;
    }

    /**
     * Loads the skyboxes from the scene graph
     * @returns 
     */
    loadSkyboxes(){
        const skyboxes = [];

        for (const skyboxID in this.data) {
            const skybox = this.loadSkybox(this.data[skyboxID]);
            skyboxes.push(skybox);
        }

        return skyboxes;
    }

    isVideoTexture(texture) {
        return texture.includes(".mp4");
    }

    /**
     * Creates a skybox with the given data
     */ 
    loadSkybox(data){
        // Create box with backside

        const skybox = new THREE.Group();
        const offset = [data.size[0] / 2, data.size[1] / 2, data.size[2] / 2]
        const faces =  ['up', 'down', 'front', 'back', 'left', 'right']
        const points = [
            [data.center[0], data.center[1] + offset[1], data.center[2]],
            [data.center[0], data.center[1] - offset[1], data.center[2]],
            [data.center[0], data.center[1], data.center[2] + offset[2]],
            [data.center[0], data.center[1], data.center[2] - offset[2]],
            [data.center[0] - offset[0], data.center[1], data.center[2]],
            [data.center[0] + offset[0], data.center[1], data.center[2]]
        ]
        const rotations = [
            [Math.PI / 2, 0, 0],
            [-Math.PI / 2, 0, 0],
            [0, Math.PI, 0],
            [0, 0, 0],
            [0, Math.PI / 2, 0],
            [0, -Math.PI / 2, 0]
        ]

        // Create the faces of the skybox
        faces.forEach((face, i) => {
            const geometry = new THREE.PlaneGeometry(...data.size);
            const material = new THREE.MeshBasicMaterial({color: 0xffffff});
            material.map = new MyTexturesLoader().loadTexture({
                filepath: data[face],
                id: "skybox_" + data[face] + "_tex",
                is_video: data[face].includes(".mp4"),
                magFilter: "LinearFilter",
                minFilter: "LinearFilter",
                type: "texture"
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...points[i]);
            mesh.rotation.set(...rotations[i]);

            skybox.add(mesh);

        });

        return skybox;
    }

}