import * as THREE from 'three';
import { MyAxis } from '../MyAxis.js';
import {MyPicker} from "../MyPicker.js";

// Cars
import { MyCar } from '../car/MyCar.js';
import { MyCarMover } from '../car/MyCarMover.js';
import { MyCarFlow } from '../car/MyCarFlow.js';
import { MyTrack } from '../track/MyTrack.js';
import { MyCheckpoints } from '../car/MyCheckpoints.js';

// Loaders
import { MyFileReader } from '../parser/MyFileReader.js';
import { MyCamerasLoader } from '../loaders/MyCamerasLoader.js';
import { MyMaterialsLoader } from '../loaders/MyMaterialsLoader.js';
import { MyGlobalsLoader } from '../loaders/MyGlobalsLoader.js';
import { MyTexturesLoader } from '../loaders/MyTexturesLoader.js';
import { MyFogLoader } from '../loaders/MyFogLoader.js';
import { MyObjectsLoader } from '../loaders/MyObjectsLoader.js';
import { MySkyboxLoader} from '../loaders/MySkyboxLoader.js'; 
import { MyObjLoader } from '../loaders/MyObjLoader.js';

// Elements

import { MyPuddle } from '../obstacles/MyPuddle.js';
import { MySnowflake } from '../obstacles/MySnowflake.js';
import { MyStar } from '../power-ups/MyStar.js';
import { MyBolt } from '../power-ups/MyBolt.js';
import { MyFloor } from '../scenery/MyFloor.js';
// Interface

import {MyStopwatch} from "../overlay/MyStopwatch.js";
import { MyCountdown } from '../overlay/MyCountdown.js';
import { MySpeedometer } from '../overlay/MySpeedometer.js';
import { MyLapCounter } from '../overlay/MyLapCounter.js';

/**
 *  This class contains the contents of out application
 */
class MyRaceContents{

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, sceneID) {
        this.app = app
        this.sceneID = sceneID
        this.scene = app.scenes[sceneID]

        // axis related attributes
        this.axisEnabled = false
     
        // plane related attributes
        this.diffusePlaneColor = "#F5F5DC"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhysicalMaterial({ color: this.diffusePlaneColor, map: this.floorTexture})

        //shadow related attributes
        this.mapSize = 2048;
        this.picker = new MyPicker(this.app, this.scene);

        this.raycaster = this.picker.raycaster;
    
        this.targetPosition = new THREE.Vector3();

        // initialization flags
        this.initDone = false;
        this.enabled = false;

        this.reader = new MyFileReader(this.app, this, this.onSceneLoaded);
		this.reader.open("scene/race_state.xml");

        this.car_files = {1: ['penguin.obj', 'penguin.mtl'], 2: ['car.obj', 'car.mtl']};


    }

    async enable() {
        this.app.setActiveCamera("Perspective");
        await this.car1.init(this.car_files[this.app.car_1]);
        await this.car2.init(this.car_files[this.app.car_2]);
        this.carFlow2.setLapTime(this.app.difficulty == 1 ? 45000 : 37500);
        this.car1.mesh.position.set(0, 0, -3);
        this.car2.mesh.position.set(0, 0, 3);
        this.car1.mesh.rotation.y = Math.PI / 2;
        this.car2.mesh.rotation.y = Math.PI / 2;

        this.enabled = true;
        
        const countdown = new MyCountdown(this.app, this.scene);
        await countdown.run();
        this.stopwatch.start();
        this.carFlow2.start();
        this.carMover1.start();
        this.speedometer.start();
        this.lapCounter.start();
    }

    /**
     * /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")

        this.globals = new MyGlobalsLoader(this.scene, data.options).loadGlobals();

        new MyFogLoader(this.scene, data.fog).loadFog();

        this.skyboxes = new MySkyboxLoader(data.skyboxes).loadSkyboxes();
        this.scene.add(this.skyboxes[0]);

        this.textures = new MyTexturesLoader(data.textures).loadTextures();
        this.materials = new MyMaterialsLoader(data.materials, this.textures).loadMaterials();

        this.cameras = new MyCamerasLoader(data.cameras, this.app.width, this.app.height);
        this.objects = new MyObjectsLoader(this.app, data, this.materials).loadObjects();

        this.scene.add(this.objects);
    }

    
    /**
     * initializes the contents
     */
    async init() {
       
        // create a stopwatch
        this.stopwatch = new MyStopwatch(this.app, this.scene);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.scene.add( ambientLight );

        // add a directional light to simulate the sun
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1, 0, 0 );
        directionalLight.position.set( 10, 15, -40 );
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom = - 30;
        directionalLight.shadow.bias = 0.001;
        this.scene.add( directionalLight );
    
        // Create a floor
        let floor = new MyFloor(700, 50);
        this.scene.add(floor);

        // Create a raceline
        let racelineGeometry = new THREE.PlaneGeometry( 20, 2.5, 32 );
        let racelineMat = new THREE.MeshBasicMaterial( {color: 0xffffff, map: new THREE.TextureLoader().load("textures/starting_grid.png")});
        this.raceline = new THREE.Mesh( racelineGeometry, racelineMat );
        
        this.raceline.rotateZ(Math.PI / 2);
        this.raceline.rotateY(Math.PI / 2);
        this.raceline.position.set(2.5, 0.01, 0);
        
        this.scene.add( this.raceline );
        
        // Create a track
        this.track = new MyTrack(this.app, 4);
        this.scene.add(this.track);

        this.checkpoints = new MyCheckpoints(this.scene, 3);

        this.currentLap = 0;

        // Creates the cars
        this.car1 = new MyCar(this.scene, 1, this.checkpoints, this.track);
        this.car2 = new MyCar(this.scene, 2, this.checkpoints, this.track);

        // Create a car mover which will move the opponent car
        this.carMover1 = new MyCarMover(this.car1);
        this.carFlow2 = new MyCarFlow(this.car2);

        this.scene.add(this.carFlow2);

        // Create the obstacles
        this.puddles = new MyPuddle(this.scene, ['ink_puddle.obj', 'ink_puddle.mtl']);
        this.snowflakes = new MySnowflake(this.scene, this.stopwatch, ['snowflake.obj', 'snowflake.mtl']);

        // Create some power ups
        this.obj_loader = new MyObjLoader(this.scene, 'assets/power-ups/');

        // Create some bolts
        this.bolts = new MyBolt(this.scene, this.stopwatch, ['bolt.obj', 'bolt.mtl']);

        // Create some stars
        this.stars = new MyStar(this.scene, ['star.obj', 'star.mtl']);

        // create a speedometer
        this.speedometer = new MySpeedometer(this.app, this.scene, this.car1);

        // create a lap counter
        this.lapCounter = new MyLapCounter(this.app, this.scene, this.car1, this.checkpoints);

        this.initDone = true;
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    /**
     * updates the axis if required
     */
    updateAxisIfRequired() {
        if (this.axisEnabled !== this.lastAxisEnabled) {
            this.lastAxisEnabled = this.axisEnabled
            if (this.axisEnabled) {
                this.scene.add(this.axis)
            }
            else {
                this.scene.remove(this.axis)
            }
        }
    }

    getCameras(){
        return this.cameras;
    }

    /**
     * Create HTML elements for the finished message in the middle of the screen
     */
    createFinishedMessage() {

        // Create a container for the message
        const container = document.getElementById("finished-container");
        container.innerHTML = "Finished!";

        // Add the container to the body
        document.body.appendChild(container);

    }
    

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        if (!this.initDone || !this.enabled) return;

        if (this.checkpoints.isLastCheckpoint(this.car1.currentCheckpoint)) {

            // Creates a message in the middle of the screen when the race is finished
            this.createFinishedMessage();

            this.stopwatch.stop();
            // Set a timeout to wait for 2 seconds
            setTimeout(() => {

                document.getElementById("finished-container").remove();
                document.getElementById('countdown-timer-container').remove();
                document.getElementById('lapCounter-container').remove();
                document.getElementById('speedometer-container').remove();
                document.getElementById('stopwatch-container').remove();

                // Switch to the next scene

                this.app.playerTime = this.stopwatch.getTime(); // Player's total time
                this.app.botTime = this.carFlow2.lapTime * this.checkpoints.laps // Bot's total time
                this.app.setActiveCamera("Front");
                this.app.changeScene(4);
                this.app.contents[4].enable();
            }, 2000);

            return;
        }

        if (this.scene.paused) {
            // Add element indicating that the game is paused
            document.getElementById("paused-container").innerHTML = "Paused";
            return;
        }
        else{
            document.getElementById("paused-container").innerHTML = "";
        } 

        // check if axis needs to be updated
        this.updateAxisIfRequired()    
        // update the cars
        this.carMover1.update();  
        this.carFlow2.update();     
        this.car1.update();
        this.car2.update();

        // Animates the obstacles
        this.snowflakes.animate();
        this.updateCamera()

        // Update the stopwatch, speedometer and lap counter
        this.stopwatch.update();
        this.speedometer.update();
        this.lapCounter.update();

        // Verifies if the car has collided with opponent car and/or obstacles
        this.car1.intersects(this.car2);
        this.puddles.checkIntersections(this.car1);
        this.snowflakes.checkIntersections(this.car1);

        // Verifies if the car has collided with power ups
        this.stars.checkIntersections(this.car1);
        this.bolts.checkIntersections(this.car1);

        // Check if the car has completed a lap and resets the power ups
        if (this.currentLap !== this.checkpoints.getCurrentLap(this.car1.currentCheckpoint)){
            this.currentLap = this.checkpoints.getCurrentLap(this.car1.currentCheckpoint);
            if (this.stars.stars.length < 2){
                this.stars.reset();
            }
            if (this.bolts.bolts.length < 2){
                this.bolts.reset();
            }
            if (this.puddles.puddles.length < 3){
                this.puddles.reset();
            }
            if (this.snowflakes.snowflakes.length < 3){
                this.snowflakes.reset();
            }

        }

    }

    // Checks if the game is paused and pauses/unpauses the scene
    togglePause(){
        if(this.scene.paused)
            this.stopwatch.resume();
        else this.stopwatch.pause();
        
        this.scene.paused = !this.scene.paused;
    }          

    // Checks if the key pressed is P and pauses/unpauses the scene
    handleKeyPress(key){
        console.log("Key pressed in racecontents")
        if (key === 'P' || key === 'p'){
            this.togglePause();
        }
    }

    /**
     * animates the contents
     */
    animate(keysPressed) {
        this.carMover1.move(keysPressed);
    }

    /**
     * updates the camera
     */
    updateCamera() {
        if (!this.enabled) return;

        const dampingFactor = 0.15;
        const horizontalOffset = -4;
        const verticalOffset = 5;
        const lateralOffset = 0;

        const carPosition = this.car1.mesh.position.clone();

        const camPos = carPosition.clone().add(
            this.car1.mesh.getWorldDirection(new THREE.Vector3()).multiplyScalar(horizontalOffset)
        ).add(new THREE.Vector3(lateralOffset, verticalOffset, 0));

        this.targetPosition.lerp(camPos, dampingFactor);

        this.app.cameras['Perspective'].position.copy(this.targetPosition);

        this.app.cameras['Perspective'].lookAt(carPosition);
    }
}

export { MyRaceContents };
