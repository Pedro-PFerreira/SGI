import * as THREE from "three"

/**
 * This class will load the cameras
 */
export class MyCamerasLoader{

    constructor(data, width, height){

        this.width = width;

        this.height = height;

        this.cameras = [];

        this.loadCameras(data);

    }

    /**
     * Loads the cameras
     * @param {Object} data
     * @returns {Array} cameras
     */
    loadCameras(data){
        console.log("[Loading cameras]")
        for (var key in data) {
            console.log("Loading camera: ", key)
            
            let camera = data[key];

            let cameraObj;

            if(camera.type === "perspective")
                cameraObj = new THREE.PerspectiveCamera(camera.angle, this.width / this.height, camera.near, camera.far);
        
            else if (camera.type === "orthogonal")
                cameraObj = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);
            
            else
                throw new Error("inconsistency: unsupported camera type " + camera.type + "!");

            cameraObj.name = key;
            cameraObj.position.set(camera.location[0], camera.location[1], camera.location[2]);
            cameraObj.lookAt(camera.target[0], camera.target[1], camera.target[2]);

            this.cameras.push(cameraObj);
        }

        if (data.length == 0)
            this.cameras.push(new THREE.PerspectiveCamera( 45, 16/9, 1, 1000 ));

        return this.cameras;
    }
}