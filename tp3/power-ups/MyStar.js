import * as THREE from 'three';
import { MyObjLoader } from '../loaders/MyObjLoader.js';

class MyStar{

    constructor(scene, files) {
        this.scene = scene;
        
        // Files used
        this.files = files;
        this.mesh = null;

        // colliding flag
        this.colliding = false;
        // Positions of the stars
        this.positions = [
            new THREE.Vector3(183, 3, 290),
            new THREE.Vector3(227, 3, 40),
        ];
        this.stars = [];
        this.setupStars();
    }

    /**
     * Loads the stars into the scene in the positions specified
     */
    setupStars(){
        const obj_loader = new MyObjLoader(this.scene, 'assets/power-ups/');
        obj_loader.load(this.files, "Star"+ this.stars.length).then((object) => {
            this.mesh = object;
            this.positions.forEach((position) => this.addStar(position));
        });
    }

    /**
     * Add a star to the scene in the specified position
     * @param {*} position 
     */
    addStar(position){
        const object = this.mesh.clone();
        object.name = "Star"+ this.stars.length;

        this.stars.push(object);
        object.scale.set(2,2,2);
        object.position.copy(position);
        this.scene.add(object);
    }

    /**
     * Resets the stars
     */
    reset(){
        this.stars.forEach(star => this.scene.remove(star));
        this.stars = [];
        this.positions.forEach((position) => this.addStar(position));
    }

    /**
     * Check, for each star, if it intersects with the player's car
     * @param {*} car 
     */
    checkIntersections(car){
        this.stars.forEach((Star, index) => {
            if(this.intersects(Star, car)){
                this.onIntersect(car, index);
                return true;
            }
        });

        // If the car has collided with a star, it will be faster for 5 seconds
        // and returns to normal speed
        if(this.colliding){
            this.colliding = false;
            setTimeout(() => {
                console.log("Car back to normal speed");
                car.speedPercent = 1;
            }, 5000);
        }

    }

    /**
     * Verifies if the boxes of the star and the car intersect
     * @param {*} Star 
     * @param {*} car 
     * @returns 
     */
    intersects(Star, car){
        const box1 = new THREE.Box3().setFromObject(Star);
        const box2 = new THREE.Box3().setFromObject(car.mesh);
        return box1.intersectsBox(box2);
    }
 
    /**
     * Actions to perform when a star intersects with the car (increases speed)
     * @param {*} car 
     * @param {*} starIndex 
     */
    onIntersect(car, starIndex){
        this.colliding = true;
        console.log("Star hit");
        car.speedPercent = 2;
        this.scene.remove(this.stars[starIndex]);
        this.stars.splice(starIndex, 1);
    }
}

export { MyStar };