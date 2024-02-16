import * as THREE from 'three';
import { MyObjLoader } from '../loaders/MyObjLoader.js';

class MyBolt {

    constructor(scene, stopwatch, files) {
        this.scene = scene;
        this.stopwatch = stopwatch;
        this.mesh = null;

        // animation related attributes
        this.yOffset = 1.5;
        this.rotationTime = 4000;
        this.upDownTime = 2000;
        this.amplitude = 0.4;
        this.t = 0;
        this.animationSpeed = 0.01;

        // Files used
        this.files = files;

        // Positions of the bolts
        this.positions = [
            new THREE.Vector3(203, 0, -20),
            new THREE.Vector3(138, 0, 240),
        ];
        this.bolts = [];
        this.setupBolts();
    }

    /**
     * Loads the bolts into the scene in the positions specified
     */
    setupBolts(){
        const obj_loader = new MyObjLoader(this.scene, 'assets/power-ups/');
        obj_loader.load(this.files, "Bolt"+ this.bolts.length).then((object) => {
            this.mesh = object;
            this.positions.forEach(position => this.addBolt(position));
        });
    }

    /**
     * Adds a bolt to the scene in the specified position
     * @param {*} position 
     */
    addBolt(position){
        const object = this.mesh.clone();
        object.name = "Bolt"+ this.bolts.length;

        this.bolts.push(object);
        object.position.copy(position);
        object.scale.set(4,4,4);
        this.scene.add(object);
    }

    /**
     * Check, for each bolt, if it intersects with the player's car
     * @param {*} car 
     */
    checkIntersections(car){
        this.bolts.forEach((Bolt, index) => {
            if(this.intersects(Bolt, car)){
                this.onIntersect(car, index);
                
                return true;
            }
            return false;
        });
    }

    /**
     * Verifies if the boxes of the bolt and the car intersect
     * @param {*} Bolt 
     * @param {*} car 
     * @returns 
     */
    intersects(Bolt, car){
        const box1 = new THREE.Box3().setFromObject(Bolt);
        const box2 = new THREE.Box3().setFromObject(car.mesh);
        return box1.intersectsBox(box2);
    }
 
    /**
     * Actions to perform when a bolt intersects with the car (decrements time)
     * @param {*} car 
     * @param {*} BoltIndex 
     */
    onIntersect(car, BoltIndex){
        console.log("Bolt hit");
        this.stopwatch.decrementTime(3000);
        this.scene.remove(this.bolts[BoltIndex]);
        this.bolts.splice(BoltIndex, 1);
    }

    /**
     * Resets the bolts
     */
    reset(){
        this.bolts.forEach(bolt => this.scene.remove(bolt));
        this.bolts = [];
        this.positions.forEach((position) => this.addBolt(position));
    }

    /**
     * Animates the bolts
     */
    animate(){
        this.bolts.forEach((Bolt, index) => {
            Bolt.position.y = this.yOffset + this.amplitude * Math.sin(this.t * 2* Math.PI);
            Bolt.rotateZ((2 * Math.PI / this.rotationTime) * this.t);
        });
        this.t += this.animationSpeed;
    }
}

export { MyBolt };