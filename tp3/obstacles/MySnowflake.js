import * as THREE from 'three';
import { MyObjLoader } from '../loaders/MyObjLoader.js';

class MySnowflake {

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

        // Positions of the snowflakes
        this.positions = [
            new THREE.Vector3( -46.78778515411085, 0.008678550185120912, 0.1865853325390514 ),
            new THREE.Vector3( 282.3572071184767, 0.008906201510391839, 307.23504134474416 ),
            new THREE.Vector3( 62.41452917913319, 0.00872502594215075, 95.2908080588001 ),
        ];
        this.snowflakes = [];
        this.setupSnowflakes();
    }

    /**
     * Loads the snowflakes into the scene in the positions specified
     */
    setupSnowflakes(){
        const obj_loader = new MyObjLoader(this.scene, 'assets/obstacles/');
        obj_loader.load(this.files, "Snowflake"+ this.snowflakes.length).then((object) => {
            this.mesh = object;
            this.positions.forEach(position => this.addSnowflake(position));
        });
    }

    /**
     * Add a snowflake to the scene in the specified position
     * @param {*} position 
     */
    addSnowflake(position){
        const object = this.mesh.clone();
        object.name = "Snowflake"+ this.snowflakes.length;

        this.applyShader(object);
        this.snowflakes.push(object);
        object.position.copy(position);
        object.rotateX(Math.PI / 2);
        object.rotateZ(Math.PI / 2);
        object.scale.set(0.025, 0.025, 0.025);
        object.position.y = this.yOffset;
        this.scene.add(object);
    }

    /**
     * Resets the snowflakes
     */
    reset(){
        this.snowflakes.forEach(snowflake => this.scene.remove(snowflake));
        this.snowflakes = [];
        this.positions.forEach((position) => this.addSnowflake(position));
    }

    /**
     * Verifies if a snowflake intersects with the player's car
     * @param {*} car 
     */
    checkIntersections(car){
        this.snowflakes.forEach((snowflake, index) => {
            if(this.intersects(snowflake, car)){
                this.onIntersect(car, index);
                return;
            }
        });
    }

    /**
     * Checks if the boxes of the snowflake and the car intersect
     * @param {*} snowflake 
     * @param {*} car 
     * @returns 
     */
    intersects(snowflake, car){
        const box1 = new THREE.Box3().setFromObject(snowflake);
        const box2 = new THREE.Box3().setFromObject(car.mesh);
        return box1.intersectsBox(box2);
    }
 
    /**
     * Applies the effect of the snowflake to the car (increases time) and removes the snowflake
     * @param {*} car 
     * @param {*} snowflakeIndex 
     */
    onIntersect(car, snowflakeIndex){
        console.log("Snowflake hit");
        this.scene.remove(this.snowflakes[snowflakeIndex]);
        this.stopwatch.incrementTime(5000);
        this.snowflakes.splice(snowflakeIndex, 1);
    }

    /**
     * Animates the snowflakes
     */
    animate(){
        this.snowflakes.forEach((snowflake, index) => {
            snowflake.position.y = this.yOffset + this.amplitude * Math.sin(this.t * 2* Math.PI);
            snowflake.rotateZ((2 * Math.PI / this.rotationTime) * this.t);
            snowflake.children[0].children[0].material.uniforms.time.value = this.t;
        });
        this.t += this.animationSpeed;
    }

    /**
     * Applies the animation shader to the snowflake
     * @param {*} snowflake 
     */
    applyShader(snowflake){
        snowflake.children[0].children[0].material = new THREE.ShaderMaterial({

            // Vertex shader for the variation of the positions of the vertices
            vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `,

            // Fragment shader for the color variation
            fragmentShader: `
            uniform float time;
            varying vec2 vUv;

            void main() {
                // Ice blue base color
                vec3 baseColor = vec3(0.5, 0.8, 1.0);

                // Radial pulse effect
                vec2 centeredUV = vUv - 0.5;
                float distanceToCenter = length(centeredUV);
                float angle = atan(centeredUV.y, centeredUV.x);
                float ripple = 0.5 + 0.5 * sin(time * 5.0 - distanceToCenter * 10.0 + angle * 5.0);
                vec3 pulseColor = vec3(0.5, 0.7, 1.0) * ripple;

                gl_FragColor = vec4(mix(baseColor, pulseColor, 0.5), 1.0);
            }
            `,
            uniforms: {
                time: { value: this.t },
            },
        });
    }

}

export { MySnowflake };