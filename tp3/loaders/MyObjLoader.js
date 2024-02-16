import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

/**
 * This class loads the .obj files and their .mtl files
 */
class MyObjLoader {
    constructor(scene, path) {
        this.scene = scene;
        this.objLoader = new OBJLoader();
        this.mtlLoader = new MTLLoader();
        this.objLoader.setPath(path);
        this.mtlLoader.setPath(path);
    }

    /**
     * Loads the object and its material
     * @param {*} files 
     * @param {*} name 
     * @returns 
     */
    async load(files, name) {
        try {
            // Promise for loading the material
            await new Promise((resolve, reject) => {
                this.mtlLoader.load(files[1], (materials) => {
                    this.objLoader.setMaterials(materials);
                    resolve();
                }, undefined, reject);
            });

            // Promise for loading the object
            const object = await this.loadObject(files[0]);

            const group = new THREE.Group();
            group.name = name;

            // Compute the normals of the object and its children and add them to the group
            object.children.forEach(child => {
                child.geometry.computeVertexNormals();
                const childGeometry = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
                child.position.sub(childGeometry);
                const childObject = new THREE.Object3D();
                childObject.name = child.name;
                childObject.position.copy(childGeometry);
                childObject.add(child.clone());

                group.add(childObject);
            });

            return group;

        } catch (error) {
            console.error('Error loading MTL for object:', error);
        }
    }

    /**
     * Loads the object from the file
     * @param {*} file 
     * @returns 
     */
    loadObject(file) {
        return new Promise((resolve, reject) => {
            this.objLoader.load(
                file,
                (object) => {
                    resolve(object);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('An error happened', error);
                    reject(error);
                }
            );
        });
    }
}

export { MyObjLoader };
