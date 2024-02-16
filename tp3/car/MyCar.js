import * as THREE from 'three';
import { MyObjLoader } from '../loaders/MyObjLoader.js';

/**
 * This class represents a car
 */
export class MyCar {

    constructor(scene, id, checkpoints, track) {
        this.id = id;
        
        // Checkpoints crossed
        this.checkpoints = checkpoints;
        this.mesh = null;

        // Track
        this.track = track;
        this.scene = scene;

        // Flag to check if the car is outside the track
        this.outsideTrack = false;

        this.obj_loader = new MyObjLoader(this.scene, 'assets/test/');

        // Speed related attributes
        this.speedPercent = 1;
        this.maxSpeed = 224;
        this.currentSpeed = 0;

        // colliding flag
        this.colliding = false;
        this.currentCheckpoint = -1;
    }

    /**
     * Loads the car into the scene
     */
    async init(files){
        const object = await this.obj_loader.load(files, "Car"+ this.id)
        this.scene.add(object);
        this.mesh = object;
        this.frontTireL = object.children.find(child => child.name === "FrontTiresL");
        this.frontTireR = object.children.find(child => child.name === "FrontTiresR");
        this.buildHitbox();
    }

    /**
     * Builds the hitbox of the car
     */
    buildHitbox() {
        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
    }

    /**
     * Called when the car is hit and reduces its speed
     */
    onIntersect(){
        this.speedPercent = 0.7;
    }

    /**
     * Resets the car's speed after 3 seconds
     */
    onIntersectOut(){
        setTimeout(() => {
            this.speedPercent = 1;
            console.log("Cars back to normal speed");
        }, 3000);
    }

    /**
     * Checks the collisions with other objects
     * @param {*} object 
     * @returns 
     */
    intersects(object){

        if (!this.mesh || !object.mesh) return false;
        const box1 = new THREE.Box3().setFromObject(this.mesh);
        let box2 = null;

        // If object is an Object3D
        if(object.mesh){
            box2 = new THREE.Box3().setFromObject(object.mesh);
        }
        else box2 = object;

        // If the boxes intersect, the cars are colliding
        if(box1.intersectsBox(box2)){
            this.onIntersect();
            object.onIntersect() || null;
            this.colliding = true;
            return true;
        }

        // After the collision, the cars are no longer colliding
        if(this.colliding){
            this.onIntersectOut();
            object.onIntersectOut() || null;
        }

        this.colliding = false;
        return false;
    }

    /**
     * Verifies if the car has passed a checkpoint
     * @returns 
     */
    passedCheckpoint(){
        if (!this.mesh) return false;

        const box = new THREE.Box3().setFromObject(this.mesh);

        // Verifies the collision with box checkpoint 
        if(box.intersectsBox(new THREE.Box3().setFromObject(this.checkpoints.nextCheckpoint(this.currentCheckpoint)))){
            this.currentCheckpoint++;
            console.log("Checkpoint " + this.currentCheckpoint + " reached");
        }
            
        if(this.checkpoints.isLastCheckpoint(this.currentCheckpoint))
            console.log("Finished");
    }

    /**
     * Verifies if the car has picked up a power up, using the hitbox
     * @param {*} powerUp 
     * @returns 
     */
    intersectedPowerUp(powerUp){
        if (!this.mesh || !powerUp.mesh) return false;
        const box1 = new THREE.Box3().setFromObject(this.mesh);
        const box2 = new THREE.Box3().setFromObject(powerUp.mesh);

        if(box1.intersectsBox(box2)){
            console.log("Car " + this.car_id + " has picked up a power up");
            
            return true;
        }
        return false;
    }

    /**
     * Verifies if the car is outside the track
     * @returns 
     */
    checkIfOutsideTrack(){
        if (!this.mesh) return;
        const direction = new THREE.Vector3(0, -1, 0);
        const position = this.mesh.position.clone();
        position.y += 0.01;

        // Raycaster to check if the car is outside the track
        const rayLength = 10;
        const raycaster = new THREE.Raycaster(position, direction, 0, rayLength );

        this.scene.remove(this.rayVisualization);
        this.rayVisualization = new THREE.ArrowHelper(direction, position, rayLength, 0xff0000);
        this.scene.add(this.rayVisualization);

        // If the raycaster doesn't intersect with the track, the car is outside the track
        const intersects = raycaster.intersectObject(this.track);

        if(intersects.length == 0){
            console.log("Car " + this.id + " is outside the track");
            this.outsideTrack = true;
        }
        else{
            this.outsideTrack = false;
        }

    }

    /** */
    getSpeedPercent(){
        return this.outsideTrack ? 0.7 : this.speedPercent;
    }


    /**
     * Updates the characteristics of the car in the various situations
     */
    update() {
        this.passedCheckpoint()
        this.checkIfOutsideTrack()
    }
}