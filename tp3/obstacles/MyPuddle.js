import * as THREE from 'three';
import { MyObjLoader } from '../loaders/MyObjLoader.js';

/**
 * This class contains the puddles
 */
class MyPuddle {

    constructor(scene, files) {
        this.scene = scene;

        // Files used
        this.files = files;

        // colliding flag
        this.colliding = false;

        this.mesh = null;

        // Positions of the puddles
        this.positions = [
            new THREE.Vector3( 79.91736810678199, 0.00811415310978191, 0.6216337310402102 ),
            new THREE.Vector3( 229.63022176377095, 0.008140164555536103, 117.0774737669353 ),
            new THREE.Vector3( -31.01822888743111, 0.007871417029466102, 81.40016870663591 ),
        ];
        this.puddles = [];
        this.setupPuddles();
    }

    /**
     * Loads the puddles into the scene in the positions specified
     */
    setupPuddles(){
        const obj_loader = new MyObjLoader(this.scene, 'assets/obstacles/');
        obj_loader.load(this.files, "Puddle"+ this.puddles.length).then((object) => {
            this.mesh = object;
            this.positions.forEach((position) => this.addPuddle(position));
        });
    }

    /**
     * Adds a puddle to the scene in the specified position
     * @param {*} position 
     */
    addPuddle(position){
        const object = this.mesh.clone();
        
        object.name = "Puddle"+ this.puddles.length;
        this.puddles.push(object);
        object.position.copy(position);
        object.rotateZ(Math.PI);
        this.scene.add(object);
    }

    /**
     * Resets the puddles
     */
    reset(){
        this.puddles.forEach(puddle => this.scene.remove(puddle));
        this.puddles = [];
        this.positions.forEach((position) => this.addPuddle(position));
    }

    /**
     * Check, for each puddle, if it intersects with the player's car
     * @param {*} car 
     */
    checkIntersections(car){
        this.puddles.forEach((puddle, index) => {
            if(this.intersects(puddle, car)){
                this.onIntersect(car, index);
                return;
            }
        });

        // If the car has collided, it will be slower for 3 seconds
        if(this.colliding){
            this.colliding = false;
            setTimeout(() => {
                console.log("Car back to normal speed");
                car.speedPercent = 1;
            }, 3000);
        }
    }

    /**
     * Verifies if the boxes of the puddle and the car intersect
     * @param {*} puddle 
     * @param {*} car 
     * @returns 
     */
    intersects(puddle, car){
        const box1 = new THREE.Box3().setFromObject(puddle);
        const box2 = new THREE.Box3().setFromObject(car.mesh);
        return box1.intersectsBox(box2);
    }
 
    /**
     * Applies the effects of the puddle to the car (decreases speed)
     * @param {*} car 
     * @param {*} puddleIndex 
     */
    onIntersect(car, puddleIndex){
        this.colliding = true;
        console.log("Puddle hit");
        car.speedPercent = 0.7;
        this.scene.remove(this.puddles[puddleIndex]);
        this.puddles.slice(puddleIndex, 1);

    }
}

export { MyPuddle };