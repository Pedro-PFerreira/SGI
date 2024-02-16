import * as THREE from 'three';
import { MyAxis } from '../MyAxis.js';
import {MyPicker} from "../MyPicker.js";
import { MyFileReader } from '../parser/MyFileReader.js';

import { MyCamerasLoader } from '../loaders/MyCamerasLoader.js';
import { MyMaterialsLoader } from '../loaders/MyMaterialsLoader.js';
import { MyGlobalsLoader } from '../loaders/MyGlobalsLoader.js';
import { MyTexturesLoader } from '../loaders/MyTexturesLoader.js';
import { MyFogLoader } from '../loaders/MyFogLoader.js';
import { MyObjectsLoader } from '../loaders/MyObjectsLoader.js';
import { MySkyboxLoader} from '../loaders/MySkyboxLoader.js'; 
import { MyObjLoader } from '../loaders/MyObjLoader.js';
import { MySpriteSheetLoader } from '../loaders/MySpriteSheetLoader.js';

/**
 *  This class contains the contents of out application
 */
class MySelectingOpptContents{

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, sceneID) {
        this.app = app
        this.sceneID = sceneID
        this.scene = app.scenes[sceneID]
        this.axis = null

        // axis related attributes
        this.axisEnabled = false

        this.car = null;
     
        // plane related attributes
        this.diffusePlaneColor = "#F5F5DC"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhysicalMaterial({ color: this.diffusePlaneColor, map: this.floorTexture})

        //shadow related attributes
        this.mapSize = 2048;

        this.picker = new MyPicker(this.app, this.scene);
        
        // Select one car
        this.picker.onClick = (obj) => {

            function findCarGroup(object) {
                // Traverse up the hierarchy to find the first ancestor with a name starting with "Car"
                while (object && !object.name.startsWith("Car")) {
                    object = object.parent;
                }
        
                return object;
            }

            let carGroup = findCarGroup(obj);

            console.log("Car group: ", carGroup);

            if (carGroup) {
                // Selects between the two cars available.
                if(carGroup.name === "Car 1 Opt" || carGroup.name === "Car 2 Opt") {
                    this.car_selected = obj.name;
                    console.log("Car selected: ", this.car_selected);

                    if(carGroup.name === "Car 1 Opt") {
                        this.app.car_2 = 1;
                    }
                    else{
                        this.app.car_2 = 2;
                    }

                    // Make difficulty levels visible
                    this.objects.children[1].visible = true;
                    this.objects.children[1].name = "easy_button";
                    this.objects.children[2].visible = true;
                    this.objects.children[2].name = "hard_button";

                    // Spritesheets for difficulty levels
                    const ease_sheet_user = new MySpriteSheetLoader("spritesheet/text_spritesheet_3.png", 13, 3.5, 0.2, 0.8);
                    const hard_sheet_user = new MySpriteSheetLoader("spritesheet/text_spritesheet_3.png", 13, 1.5, 0.2, 0.8);

                    let easy_to_load = "EASY";
                    let hard_to_load = "HARD";

                    let easy_sprite = ease_sheet_user.loadText(easy_to_load);
                    let hard_sprite = hard_sheet_user.loadText(hard_to_load);

                    for (let i = 0; i < easy_sprite.length; i++) {
                        easy_sprite[i].name = "easy_button";
                        easy_sprite[i].scale.set(0.05, 0.05, 0.05);

                        hard_sprite[i].name = "hard_button";
                        hard_sprite[i].scale.set(0.05, 0.05, 0.05);

                        this.scene.add(easy_sprite[i]);
                        this.scene.add(hard_sprite[i]);
                    }   
                }
            }
            else if(obj.name === "easy_button" || obj.name === "hard_button") {

                // Transmists the difficulty level to the next scene
                if(obj.name === "easy_button") {
                    this.app.difficulty = 1;
                }
                else{
                    this.app.difficulty = 2;
                }
                // Make next button visible
                this.objects.children[0].visible = true;
                this.objects.children[0].name = "next_button";

                const sprite_sheet_user = new MySpriteSheetLoader("spritesheet/text_spritesheet_3.png", 12.8, -0.3, 0.2, 1);
                let text_to_load = "NEXT";

                let user_sprite = sprite_sheet_user.loadText(text_to_load);

                for (let i = 0; i < user_sprite.length; i++) {
                    user_sprite[i].name = "next_button";
                    user_sprite[i].scale.set(0.05, 0.05, 0.05);
                    this.scene.add(user_sprite[i]);
                }
            }
            else if(obj.name === "next_button") {
                this.app.changeScene(3);
                this.app.contents[3].enable();
            }            
            return;
        }

        this.picker.onHover = (obj) => {

            if(obj.name != "Body") return

            // Change color of the car when hovering
            if ((this.picker.lastPickedObj != obj)) {
                if (this.picker.lastPickedObj)
                    this.picker.lastPickedObj.material.color.setHex(this.picker.lastPickedObj.currentHex);
                this.picker.lastPickedObj = obj;
                this.picker.lastPickedObj.currentHex = this.picker.lastPickedObj.material.color.getHex();
                this.picker.lastPickedObj.material.color.setHex(this.picker.pickingColor);
            }
        }

        this.picker.onHoverOut = () => {
            if (this.picker.lastPickedObj)
                this.picker.lastPickedObj.material.color.setHex(this.picker.lastPickedObj.currentHex);
            this.picker.lastPickedObj = null;
        }

        this.raycaster = this.picker.raycaster;

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scene/selecting_oppt_state.xml");
    }
    
    /**
     * initializes the contents
     */
    init() {

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    async onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")

        this.globals = new MyGlobalsLoader(this.scene, data.options).loadGlobals();

        new MyFogLoader(this.scene, data.fog).loadFog();

        this.skyboxes = new MySkyboxLoader(data.skyboxes).loadSkyboxes();
        this.scene.add(this.skyboxes[0]);

        this.textures = new MyTexturesLoader(data.textures).loadTextures();
        this.materials = new MyMaterialsLoader(data.materials, this.textures).loadMaterials();

        this.cameras = new MyCamerasLoader(data.cameras, this.app.width, this.app.height);
        this.objects = new MyObjectsLoader(this.app, data, this.materials).loadObjects();

        // Make the button temporarily invisible
        this.objects.children[0].visible = false;
        this.objects.children[1].visible = false;
        this.objects.children[2].visible = false;

        // Title
        const sprite_sheet_path = "spritesheet/text_spritesheet_3.png";
        const sprite_sheet_title = new MySpriteSheetLoader(sprite_sheet_path, -10, 7, 0, 1.1);

        let screen_title = "SELECT YOUR OPOONENT CAR";

        let title_sprite = sprite_sheet_title.loadText(screen_title);

        for (let i = 0; i < title_sprite.length; i++) {
            title_sprite[i].scale.set(0.05, 0.05, 0.05);
            this.scene.add(title_sprite[i]);
        }

        // Cars names
        const sprite_sheet_car1 = new MySpriteSheetLoader(sprite_sheet_path, -7, 5, 0, 1);
        const sprite_sheet_car2 = new MySpriteSheetLoader(sprite_sheet_path, 5, 5, 0, 1);

        let car1_name = "RENO PINGU";
        let car2_name = "RENO R4.5";

        let car1_sprite = sprite_sheet_car1.loadText(car1_name);
        let car2_sprite = sprite_sheet_car2.loadText(car2_name);

        for (let i = 0; i < car1_sprite.length; i++) {
            car1_sprite[i].scale.set(0.05, 0.05, 0.05);
            this.scene.add(car1_sprite[i]);
        }

        for (let i = 0; i < car2_sprite.length; i++) {
            car2_sprite[i].scale.set(0.05, 0.05, 0.05);
            this.scene.add(car2_sprite[i]);
        }

        // Cars
        const files_penguin = ["penguin.obj", "penguin.mtl"];

        const files_car = ["car.obj", "car.mtl"];

        this.obj_loader = new MyObjLoader(this.scene, 'assets/test/');
        

        this.car_1 = await this.obj_loader.load(files_penguin, "Car 1 Opt");
        this.car_2 = await this.obj_loader.load(files_car, "Car 2 Opt");

        this.car_1.position.set(-2, 0, 0);
        this.car_1.scale.set(0.5, 0.5, 0.5);
        this.car_1.rotateY(Math.PI/9);

        this.car_2.position.set(8, 0, 0);
        this.car_2.scale.set(0.5, 0.5, 0.5);
        this.car_2.rotateY(-Math.PI/9);
        
        // Add objects to scene
        this.scene.add(this.objects);
        this.scene.add(this.car_1);
        this.scene.add(this.car_2);       
        
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }


    /**
     * Loads the nodes of the scene graph and prtin them to the console
     * @param {*} data 
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        console.log("nodes:")
        for (var key in data.nodes) {
            console.log("Loading node: ", key, typeof(key))
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
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
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if axis needs to be updated
        this.updateAxisIfRequired()         
    }

}

export { MySelectingOpptContents};