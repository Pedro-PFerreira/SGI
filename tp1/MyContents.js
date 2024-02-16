import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyRoom } from './MyRoom.js';
import { MyTable } from './MyTable.js';
import { MyCake  } from './MyCake.js';
import { MyBeetle } from './MyBeetle.js';
import { MyJar } from './MyJar.js';
import { MyFlower } from './MyFlower.js';
import { MySpring } from './MySpring.js';
import { MyNewspaper } from './MyNewspaper.js';
import { MyLamp } from './MyLamp.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // axis related attributes
        this.axisEnabled = true
     
        // plane related attributes
        this.diffusePlaneColor = "#F5F5DC"
        this.planeShininess = 30
        this.floorTexture = new THREE.TextureLoader().load('textures/wood_floor.jpg'),
        this.planeMaterial = new THREE.MeshPhysicalMaterial({ color: this.diffusePlaneColor, map: this.floorTexture})

        //shadow related attributes
        this.mapSize = 2048;    
        
    }
    
    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

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
        this.app.scene.add( directionalLight );
    
        
        let floor = new THREE.BoxGeometry(15, 15, 0.1);
        this.floorMesh = new THREE.Mesh( floor, this.planeMaterial );
        this.floorMesh.receiveShadow = true;
        this.floorMesh.castShadow = true;
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add( this.floorMesh );

        // create the lamp
        this.lamp = new MyLamp();
        this.app.scene.add(this.lamp);

        // create the room
        this.room = new MyRoom();
        this.app.scene.add(this.room);
        
        //create the table
        this.table = new MyTable(3, 3, 0.25, 0.2, 2);
        this.app.scene.add(this.table);


        // Create the cake
        this.cake = new MyCake(0.4, 0.4);
        this.app.scene.add(this.cake);

        // Add spotlight above the cake
        const spotLight = new THREE.SpotLight(0xffffff, 4);
        spotLight.position.set(0, 3, 0);
        spotLight.castShadow = true;
        spotLight.target = this.cake;
        spotLight.angle = Math.PI / 3.15;
        spotLight.penumbra = 0.1;
        this.app.scene.add(spotLight);

        // Add the Beetle
        this.beetle = new MyBeetle();
        this.app.scene.add(this.beetle);

        // Add the jar
        this.jar = new MyJar();
        this.jar.position.set(0, 0,-1.25);
        this.jar.receiveShadow = true;
        this.app.scene.add(this.jar);

        // Add the flower
        this.flower = new MyFlower();
        this.flower.position.set(1.2, 1.7,-1.3);
        this.flower.rotation.set(0, -Math.PI, 0);
        this.app.scene.add(this.flower);

        // Add the spring
        this.spring = new MySpring(0.2, 0.0075, 0.4, 15 * Math.PI, 350);
        this.spring.position.set(1, 2.26, 1);
        this.spring.castShadow = true;
        this.app.scene.add(this.spring);

        // Add the newspaper
        this.newspaper = new MyNewspaper();
        this.newspaper.position.set(-1.05, 2.2, 0.75);
        this.newspaper.scale.set(0.65, 0.75, 0.65);
        this.newspaper.castShadow = true;
        this.app.scene.add(this.newspaper);
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    updateAxisIfRequired() {
        if (this.axisEnabled !== this.lastAxisEnabled) {
            this.lastAxisEnabled = this.axisEnabled
            if (this.axisEnabled) {
                this.app.scene.add(this.axis)
            }
            else {
                this.app.scene.remove(this.axis)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if axis needs to be updated
        this.updateAxisIfRequired()        
    }

}

export { MyContents };