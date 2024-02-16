import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        // adds a folder to the gui interface for the axis
        const axisFolder = this.datgui.addFolder('Axis');
        axisFolder.add(this.contents, 'axisEnabled', true).name("enabled");

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera');

        let cameraNames = [];

        for (let camera of this.contents.cameras.cameras) {

            cameraNames.push(camera.name);
        }
    
        cameraFolder.add(this.app, 'activeCameraName', cameraNames ).name("active camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("z coord")
        cameraFolder.open();

        // Adds a for the ambient and background light of the scene
        const lightFolder = this.datgui.addFolder('Ambient Light');
        lightFolder.add(this.contents.globals[0], 'intensity', 0, 1).name("Intensity");
        lightFolder.open();

    }
}

export { MyGuiInterface };