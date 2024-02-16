import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';

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
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective 2','Left', 'Top', 'Front', 'Right', 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open();

        const data_pic_color = {
            'picking color': '#00ff00'
        };

        const pickFolder = this.datgui.addFolder('Picking');
        pickFolder.addColor(data_pic_color, 'picking color').onChange((value) => { this.contents.updatePickingColor(value) });
        pickFolder.add(this.contents.raycaster, 'near', 0, 5)
        pickFolder.add(this.contents.raycaster, 'far', 5, 80)
        pickFolder.add(this.contents, 'selectedLayer', ['none', '1', '2', '3']).name("selected layer").onChange((value) => { this.contents.selectedLayers = value; this.contents.updateSelectedLayer() });
        pickFolder.open();

    }
}

export { MyGuiInterface };