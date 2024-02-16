import * as THREE from 'three';
import { MyAxis } from '../MyAxis.js';
import {MyPicker} from "../MyPicker.js";
import { MyFileReader } from '../parser/MyFileReader.js';

// Loaders
import { MyGlobalsLoader } from '../loaders/MyGlobalsLoader.js';
import { MyTexturesLoader } from '../loaders/MyTexturesLoader.js';
import { MyFogLoader } from '../loaders/MyFogLoader.js';
import { MySkyboxLoader} from '../loaders/MySkyboxLoader.js';
import { MyObjectsLoader } from '../loaders/MyObjectsLoader.js';
import { MySpriteSheetLoader } from '../loaders/MySpriteSheetLoader.js';


import { MyFireworks } from '../particles/MyFireworks.js';

/**
 *  This class contains the contents of out application
 */
class MyFinalContents{

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

        // Changes to the respective scene when the user clicks on the screen
        // this.picker.onClick = (obj) => {

        //     console.log("Clicked on: ", obj.parent.name);

        //     if (obj.parent.name === "restart") {
        //         this.app.contents[3] = new MyRaceContents(this.app, 3);
        //         this.app.contents[3].init();
        //         this.app.contents[3].enable();
        //         this.app.changeScene(3);
        //     }
        //     else if (obj.parent.name === "home") {
        //         this.app.contents[3] = new MyRaceContents(this.app, 3);
        //         this.app.contents.map(async content => await content.init());
        //         this.app.setActiveCamera("Front");
        //         this.app.changeScene(0);
        //     }

        // }

        this.raycaster = this.picker.raycaster;

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scene/final_state.xml");
    }
    
    /**
     * initializes the contents
     */
    enable() {
        
        this.app.setActiveCamera('Front')

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.scene.add(this.axis)
        }

        // Sprite sheets

        // Text info
        const sprite_sheet_path = "spritesheet/text_spritesheet_3.png";
        const sprite_sheet_title = new MySpriteSheetLoader(sprite_sheet_path, -30, 70, 0, 5);
        const sprite_sheet_win_or_lose_text = new MySpriteSheetLoader(sprite_sheet_path, -20, 62, 0, 5);
        const sprite_sheet_difficulty_text = new MySpriteSheetLoader(sprite_sheet_path, -50, 55, 0, 5);

        const sprite_sheet_first_text = new MySpriteSheetLoader(sprite_sheet_path, -50, 50, 0, 5);
        const sprite_sheet_car1_text = new MySpriteSheetLoader(sprite_sheet_path, -50, 45, 0, 5);
        const sprite_sheet_second_text = new MySpriteSheetLoader(sprite_sheet_path, -50, 40, 0, 5);
        const sprite_sheet_car2_text = new MySpriteSheetLoader(sprite_sheet_path, -50, 35, 0, 5);
        
        // Buttons
        const sprite_sheet_restart_button = new MySpriteSheetLoader(sprite_sheet_path, -25, 30, 0, 1.5);
        const sprite_sheet_home_button = new MySpriteSheetLoader(sprite_sheet_path, 17.5, 30, 0, 1.5);

        let game_title = "FINISHED RACE";

        let game_title_sprite = sprite_sheet_title.loadText(game_title);

        // Texts
        let win_or_lose_text ="";
        let first_text = "";
        let second_text = "";
        let difficulty_text = this.app.difficulty == 1 ? "DIFFICULTY: EASY": "DIFFICULTY: HARD";
        let car1_text = this.app.car_1 == 1 ? "CAR USED: RENO PINGU" : "CAR USED: RENO R4.5";
        let car2_text = this.app.car_2 == 1 ? "CAR USED: RENO PINGU" : "CAR USED: RENO R4.5";
        // Number to string
        let time1_text = new Date(this.app.playerTime).toISOString().substr(14, 5);
        let time2_text = new Date(this.app.botTime).toISOString().substr(14, 5);

        // Sprites
        let win_or_lose_text_sprite = null;        

        // Load text according to the result
        if (this.app.playerTime < this.app.botTime) {
            win_or_lose_text = "YOU WIN";
            win_or_lose_text_sprite = sprite_sheet_win_or_lose_text.loadText(win_or_lose_text);

            first_text = "1ST:" + this.app.playerName + "TIME: " + time1_text; // TODO - get player name and time
            second_text = "2ND: " + "PLAYER 2" + "TIME: " + time2_text; // TODO - get bot time

            // Fireworks for the winner

            this.fireworks = new MyFireworks(this.scene, new THREE.Vector3(3, 0, 3), new THREE.Vector3(0, 0, 0), 20, 75, 50);
            
            setInterval(() => {

                const minX = -25;
                const maxX = 50;
                const minY = 70;
                const maxY = 100;
                
                let random_explsion_position = new THREE.Vector3(
                    THREE.MathUtils.clamp(Math.random() * 100 - 50, minX, maxX),
                    THREE.MathUtils.clamp(Math.random() * 100 - 50, minY, maxY),
                    Math.random() * 100 - 50
                );
                
                this.fireworks = new MyFireworks(this.scene, new THREE.Vector3(3, 0, 3), random_explsion_position, 20, 75, 50);
                this.fireworks.start();
            }, 3000);
        }
        else{
            // Losing message
            win_or_lose_text = "YOU LOSE";
            win_or_lose_text_sprite = sprite_sheet_win_or_lose_text.loadText(win_or_lose_text);
            
            first_text = "1ST: " + "PLAYER 2" + "TIME: " + time2_text; // TODO - get bot time
            second_text = "2ND: " + this.app.playerName + "TIME: " + time1_text;
           
        }

        // Create sprites
        let first_text_sprite = sprite_sheet_first_text.loadText(first_text);
        let car1_text_sprite = sprite_sheet_car1_text.loadText(car1_text);
        let second_text_sprite = sprite_sheet_second_text.loadText(second_text);
        let car2_text_sprite = sprite_sheet_car2_text.loadText(car2_text);
        let difficulty_text_sprite = sprite_sheet_difficulty_text.loadText(difficulty_text);        


        // Add all the sprites to scene
        for (let i = 0; i < game_title_sprite.length; i++) {
            game_title_sprite[i].scale.set(0.5, 0.5, 0.5);
            this.scene.add(game_title_sprite[i]);
        }

        for (let i = 0; i < win_or_lose_text_sprite.length; i++) {
            win_or_lose_text_sprite[i].scale.set(0.5, 0.5, 0.5);
            this.scene.add(win_or_lose_text_sprite[i]);
        }

        for (let i = 0; i < first_text_sprite.length; i++) {
            first_text_sprite[i].scale.set(0.3, 0.3, 0.3);
            this.scene.add(first_text_sprite[i]);
        }

        for (let i = 0; i < car1_text_sprite.length; i++) {
            car1_text_sprite[i].scale.set(0.3, 0.3, 0.3);
            this.scene.add(car1_text_sprite[i]);
        }

        for (let i = 0; i < second_text_sprite.length; i++) {
            second_text_sprite[i].scale.set(0.3, 0.3, 0.3);
            this.scene.add(second_text_sprite[i]);
        }

        for (let i = 0; i < car2_text_sprite.length; i++) {
            car2_text_sprite[i].scale.set(0.3, 0.3, 0.3);
            this.scene.add(car2_text_sprite[i]);
        }

        for (let i = 0; i < difficulty_text_sprite.length; i++) {
            difficulty_text_sprite[i].scale.set(0.3, 0.3, 0.3);
            this.scene.add(difficulty_text_sprite[i]);
        }

        // Create restart and home buttons
        // // Restart button
        // const restart_button_text = sprite_sheet_restart_button.loadText("RESTART");
        // for (let i = 0; i < restart_button_text.length; i++) {
        //     restart_button_text[i].scale.set(0.1, 0.1, 0.1);
        //     restart_button_text[i].name = "restart_button";
        //     this.scene.add(restart_button_text[i]);
        // }

        // // Home button     
        // const home_button_text = sprite_sheet_home_button.loadText("HOME");
        // for (let i = 0; i < home_button_text.length; i++) {
        //     home_button_text[i].scale.set(0.1, 0.1, 0.1);
        //     home_button_text[i].name = "home_button";
        //     this.scene.add(home_button_text[i]);
        // }

    }

    onSceneLoaded(data) {
        // Loads the scene data
        this.globals = new MyGlobalsLoader(this.scene, data.options).loadGlobals();

        new MyFogLoader(this.scene, data.fog).loadFog();

        this.skyboxes = new MySkyboxLoader(data.skyboxes).loadSkyboxes();
        this.scene.add(this.skyboxes[0]);

        this.textures = new MyTexturesLoader(data.textures).loadTextures();

        this.objects = new MyObjectsLoader(this.scene, data, this.textures).loadObjects();

        this.scene.add(this.objects);

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
        this.updateAxisIfRequired();

        // Update fireworks
        if (this.fireworks !== undefined) this.fireworks.update();
    }

}

export { MyFinalContents};