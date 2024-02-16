/**
 * This class loads the shadows (fog);
 */
export class MyFogLoader{

    constructor(scene, fog){

        this.scene = scene;
        this.fog = fog;

    }

    /**
     * Loads the fog from the scene graph
     */
    loadFog(){

        const fog = this.fog;

        console.log("[Loading Fog]: ", fog);

        this.scene.fog = fog;
    }

}