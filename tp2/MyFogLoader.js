import * as THREE from 'three';

/**
 * This class loads the shadows (fog);
 */
export class MyFogLoader{

    constructor(app, fog){

        this.app = app;
        this.fog = fog;

    }

    /**
     * Loads the fog from the scene graph
     */
    loadFog(){

        const fog = this.fog;

        console.log("[Loading Fog]: ", fog);

        this.app.scene.fog = fog;
    }

}