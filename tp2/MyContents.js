import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyCamerasLoader } from './MyCamerasLoader.js';
import { MyMaterialsLoader } from './MyMaterialsLoader.js';
import { MyGlobalsLoader } from './MyGlobalsLoader.js';
import { MyTexturesLoader } from './MyTexturesLoader.js';
import { MyFogLoader } from './MyFogLoader.js';
import { MyObjectsLoader } from './MyObjectLoader.js';
import { MySkyboxLoader} from './MySkyboxLoader.js'; 

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
    
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/SGI_TP2_XML_T03_G01_v02.xml");
        //this.reader.open("scenes/demo/demo.xml");	
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.PlaneGeometry = new THREE.PlaneGeometry(4, 5, 4, 16, 16, 16);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")

        this.globals = new MyGlobalsLoader(this.app, data.options).loadGlobals();

        new MyFogLoader(this.app, data.fog).loadFog();

        this.skyboxes = new MySkyboxLoader(data.skyboxes).loadSkyboxes();
        this.app.scene.add(this.skyboxes[0]);

        this.textures = new MyTexturesLoader(data.textures).loadTextures();
        this.materials = new MyMaterialsLoader(data.materials, this.textures).loadMaterials();

        this.cameras = new MyCamerasLoader(data.cameras, this.app.width, this.app.height);
        this.objects = new MyObjectsLoader(this.app, data, this.materials).loadObjects();
        
        this.app.scene.add(this.objects);
        
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
                this.app.scene.add(this.axis)
            }
            else {
                this.app.scene.remove(this.axis)
            }
        }
    }

    getCameras(){
        return this.cameras;
    }

    /**
     * Updates the axis when the contents are updated
     */
    update() {
        this.updateAxisIfRequired();
    }
}

export { MyContents };