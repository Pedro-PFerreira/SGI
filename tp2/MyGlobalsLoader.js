import * as THREE from "three"

/**
 * This class will load the globals
 */
export class MyGlobalsLoader{

    constructor(app, data){
        this.data = data;
        this.app = app;

        this.globals = [];
    }

    /**
     * Loads the globals from the scene graph
     * @returns {Array} globals
     */
    loadGlobals(){
        const ambient = this.data.ambient;
        const background = this.data.background;

        console.log("[Loading globals]")
        console.log("Loading ambient: ", ambient)
        console.log("Loading background: ", background)

        this.app.scene.background = background;

        let ambient_light = new THREE.AmbientLight(ambient);
        this.app.scene.add(ambient_light);

        this.globals.push(ambient_light);

        return this.globals;

    }
}