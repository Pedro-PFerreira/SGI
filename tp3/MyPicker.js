import * as THREE from 'three';

export class MyPicker extends THREE.Group {

    constructor (app, scene) {
        super();
        this.app = app;
        this.scene = scene;
        this.onClick = (obj) => {return};
        this.onHover = (obj) => {return};
        this.onHoverOut = () => {return};

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1
        this.raycaster.far = 50

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x00ff00"
        this.lastPickedObj = null


        // structure of layers: each layer will contain its objects
        // this can be used to select objects that are pickeable     
        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]    // change this in interface

        // define the objects ids that are not to be pickeable
        // NOTICE: not a ThreeJS facility
        this.notPickableObjIds = ['penguin'] // Select track
      
        //register events

        document.addEventListener(
            "pointermove",
            // "mousemove",
            this.onPointerMove.bind(this)
        );

        document.addEventListener(
            "pointerdown",
            // "mousedown",
            this.onPointerDown.bind(this)
        );

    }

    /*
    *
    * Only object from selected layer will be eligible for selection
    * when 'none' is selected no layer is active, so all objects can be selected
    */
    updateSelectedLayer() {
        this.raycaster.layers.enableAll()
        if (this.selectedLayer !== 'none') {
            const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
            this.raycaster.layers.set(selectedIndex)
        }
    }

    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                this.onHoverOut()
                console.log("Object cannot be picked !")
            }
            else    
                this.onHover(obj)
        } else {
            this.onHoverOut()
        }
    }

    onPointerMove(event) {
        if(!this.scene.visible)
            return false;

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        this.pickingHelper(intersects)
    }

    onPointerDown(event) {
        if(!this.scene.visible)
            return false;
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        //4. process the intersections
        if (intersects.length > 0) {
            console.log("Intersection: ", intersects[0].point);
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                console.log("Object cannot be picked !")
                return false;
            }
            else {
                console.log("Object picked: " + obj.name);
                this.onClick(obj);
                return true;
            }
        }

        return false;
    }

    /**
     * updates the contents
     * this method is called from the render method of the scene
     *
     */
    update() {
    }

}