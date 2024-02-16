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
import { MySpriteSheetLoader } from '../loaders/MySpriteSheetLoader.js';

/**
 *  This class contains the contents of out application
 */
class MyMenuContents{

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
        this.axisEnabled = true
     
        // plane related attributes
        this.diffusePlaneColor = "#F5F5DC"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhysicalMaterial({ color: this.diffusePlaneColor, map: this.floorTexture})

        //shadow related attributes
        this.mapSize = 2048;

        this.picker = new MyPicker(this.app, this.scene);
        
        // Changes to the selection scene when the user clicks on the screen    
        this.picker.onClick = (obj) => {
            this.app.changeScene(1);
            this.app.setActiveCamera("Perspective 2");
        }

        this.raycaster = this.picker.raycaster;

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scene/initial_state.xml");
    }
    
    /**
     * initializes the contents
     */
    init() {
        
        this.app.setActiveCamera('Front')

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

        // Sprite sheets
        const sprite_sheet_path = "spritesheet/text_spritesheet_3.png";
        const sprite_sheet_title = new MySpriteSheetLoader(sprite_sheet_path, -25, 70, 0, 5);
        const sprite_sheet_authors = new MySpriteSheetLoader(sprite_sheet_path, -50, 60, 0, 3);
        const sprite_sheet_authors_1 = new MySpriteSheetLoader(sprite_sheet_path, -25, 60, 0, 5);
        const sprite_sheet_authors_2 = new MySpriteSheetLoader(sprite_sheet_path, -50, 50, 0, 5);

        // Title and authors
        let game_title = "FORMULA 0.5";
        let authors = "BY:";
        let author1 = "LOURENCO GONCALVES";
        let author2 = "AND PEDRO FERREIRA FEUP";


        let game_title_sprite = sprite_sheet_title.loadText(game_title);
        let authors_sprite = sprite_sheet_authors.loadText(authors);
        let author1_sprite = sprite_sheet_authors_1.loadText(author1);
        let author2_sprite = sprite_sheet_authors_2.loadText(author2);

        // Add sprites to scene
        for (let i = 0; i < game_title_sprite.length; i++) {
            game_title_sprite[i].scale.set(0.5, 0.5, 0.5);
            this.scene.add(game_title_sprite[i]);
        }

        for (let i = 0; i < authors_sprite.length; i++) {
            authors_sprite[i].scale.set(0.4, 0.4, 0.4);
            this.scene.add(authors_sprite[i]);
        }

        for (let i = 0; i < author1_sprite.length; i++) {
            author1_sprite[i].scale.set(0.4, 0.4, 0.4);
            this.scene.add(author1_sprite[i]);
        }

        for (let i = 0; i < author2_sprite.length; i++) {
            author2_sprite[i].scale.set(0.4, 0.4, 0.4);
            this.scene.add(author2_sprite[i]);
        }

        // Text input
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', 'input');
        input.setAttribute('placeholder', 'Insert your name');
        input.setAttribute('maxlength', '50');
        input.setAttribute('style', 'position: absolute; top: 80%; left: 45%; width: 10%; height: 5%; font-size: 30px; text-align: center; border: 2px solid black; border-radius: 10px; background-color: #F5F5DC;');
        document.body.appendChild(input);

        // Function to get the input value
        function welcomeUser(scene, objects) {
            //Capitalize input
            let input = document.getElementById('input');
            input.value = input.value.toUpperCase();

            // Setting up the user name

            this.app.playerName = input.value;

            let inputValue = input.value;

            // Creates sprite sheet for welcome message and adds it to scene
            const sprite_sheet_user = new MySpriteSheetLoader(sprite_sheet_path, -25, 40, 0, 5);

            let text_to_load = "WELCOME,"+ inputValue;

            let user_sprite = sprite_sheet_user.loadText(text_to_load);

            for (let i = 0; i < user_sprite.length; i++) {
                user_sprite[i].scale.set(0.4, 0.4, 0.4);
                scene.add(user_sprite[i]);
            }          
            
            // Remove input and button
            input.remove();
            button.remove();

            // Add button to start game
            const sprite_sheet_start = new MySpriteSheetLoader(sprite_sheet_path, -4, 30, 0, 2);

            text_to_load = "START";

            let start_sprite = sprite_sheet_start.loadText(text_to_load);

            for (let i = 0; i < start_sprite.length; i++) {
                start_sprite[i].scale.set(0.15, 0.15, 0.15);
                scene.add(start_sprite[i]);
            }   

            // Add objects to scene
            scene.add(objects);
        }

        // Button to input player's name
        let button = document.createElement('button');
        button.textContent = 'Enter';
        button.setAttribute('style', 'position: absolute; top: 90%; left: 49%; font-size: 20px; padding: 10px;');
        button.addEventListener('click', welcomeUser.bind(this, this.scene, this.objects));
        document.body.appendChild(button);

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

export { MyMenuContents};