import * as THREE from 'three';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js';

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 50;

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.keysPressed = [];
        this.animationFrameId = null;

        this.contents = [];

        // Scene-related attributes
        this.scenes = [];
        this.activeScene = 0;

        // Player-related attributes
        this.playerName = "";
        this.playerTime = 0;

        // Game-related attributes
        this.car_1 = 1;
        this.car_2 = 1;
        this.botTime = 0;
        this.difficulty = 1;
    }
    
    /**
     * initializes the application
     */
    init() {

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera("Perspective");


        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false);

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
          
        document.addEventListener("keyup", this.handleKeyUp.bind(this));

        document.addEventListener("keypress", this.handleKeyPress.bind(this));
    }

    // Handle key presses
    handleKeyPress(event) {
        if(this.contents[this.activeScene].handleKeyPress)
            this.contents[this.activeScene].handleKeyPress(event.key);
    }

    // Handle key clicks
    handleKeyDown(event) {
        if (!this.keysPressed.includes(event.key)) {
            console.log("key", event.key, "pressed");
            this.keysPressed.push(event.key);
            
            if (!this.animationFrameId) {
                this.animate();
            }
        }
    }
    
    // Handle key releases
    handleKeyUp(event) {
        console.log("key", event.key, "released");
        // Remove the key from the array when it is released
        const index = this.keysPressed.indexOf(event.key);
        if (index !== -1) {
            this.keysPressed.splice(index, 1);
        }
        // Cancel the animation frame if all keys are released
        if (this.keysPressed.length === 0) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * the main animation loop
     */
    animate() {
        this.contents[this.activeScene].animate(this.keysPressed);
      
        // Request the next animation frame
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

        this.onResize()
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 120, aspect, 0.1, 1000 )
        perspective1.position.set(3,3,4)
        this.cameras['Perspective'] = perspective1

        // defines the frustum size for the orthographic cameras
        const left = -this.frustumSize / 2 * aspect
        const right = this.frustumSize /2 * aspect 
        const top = this.frustumSize / 2 
        const bottom = -this.frustumSize / 2
        const near = -this.frustumSize /2
        const far =  this.frustumSize

        // create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoLeft.up = new THREE.Vector3(0,1,0);
        orthoLeft.position.set(-this.frustumSize /4,0,0) 
        orthoLeft.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Left'] = orthoLeft

        // create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0,-1,0);
        orthoTop.position.set(50, 50, 100); 
        orthoTop.lookAt( new THREE.Vector3(50,0,100));
        this.cameras['Top'] = orthoTop

        // create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera( left, right, top, bottom,  0.1, 1000);
        orthoFront.up = new THREE.Vector3(0,1,0);
        orthoFront.position.set(0,50,50); 
        orthoFront.lookAt( new THREE.Vector3(0,50,50));
        this.cameras['Front'] = orthoFront

        // create a back view orthographic camera
        const orthoBack = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoBack.up = new THREE.Vector3(0,1,0);
        orthoBack.position.set(0,0, -this.frustumSize /4) 
        orthoBack.lookAt( new THREE.Vector3(0,0,0));
        this.cameras['Back'] = orthoBack

        // create the right view orthographic camera
        const orthoRight = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoRight.up = new THREE.Vector3(0,1,0);
        orthoRight.position.set(this.frustumSize /4,0,0)
        orthoRight.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Right'] = orthoRight

        
        // create a new perspective camera
        const perspective2 = new THREE.PerspectiveCamera( 120, aspect, 0.1, 1000 )
        perspective2.position.set(3,3,4)
        this.cameras['Perspective 2'] = perspective2;
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()
        }
    }

    /**
     * gets the active camera
     */
    getActiveCamera() {
        return this.cameras[this.activeCameraName]
    }


    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    // Add scene to the scene list
    addScene(scene){
        scene.visible = false;
        this.scenes.push(scene);
    }

    // Change the active scene
    changeScene(sceneID){
        this.activeScene = sceneID;
        this.scenes.map((scene, index) => scene.visible = (index == sceneID));
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents[this.activeScene].update()
        }

        // render the scene
        this.renderer.render(this.scenes[this.activeScene], this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}

export { MyApp };