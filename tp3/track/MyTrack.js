import * as THREE from 'three';

export class MyTrack extends THREE.Group {

    /**
     * Track constructor
     * @param {*} app 
     */
    constructor(app, id) {
        super();
        this.track_id = id;
        this.app = app;
        this.width = 10;
        this.segments = 100;
        this.textureRepeat = 1;
        this.show_wireframe = false;
        this.show_mesh = true;
        this.show_line = false;
        this.closed_curve = true;

        this.path = this.makeCurve()

        this.buildTrack();
    }

    /**
     * makes the curve for the race track
     * @returns {THREE.CatmullRomCurve3} curve
     */
    makeCurve(){

        // Points for the curve
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(120, 0, 0),
            new THREE.Vector3(140, 0, 20),
            new THREE.Vector3(160, 0, -10),
            new THREE.Vector3(200, 0, -20),
            new THREE.Vector3(220, 0, 40),
            new THREE.Vector3(240, 0, 140),
            new THREE.Vector3(260, 0, 180),
            new THREE.Vector3(300, 0, 300),
            new THREE.Vector3(200, 0, 310),
            new THREE.Vector3(180, 0, 290),
            new THREE.Vector3(160, 0, 260),
            new THREE.Vector3(140, 0, 240),
            new THREE.Vector3(60, 0, 90),
            new THREE.Vector3(50, 0, 110),
            new THREE.Vector3(30, 0, 100),
            new THREE.Vector3(0, 0, 90),
            new THREE.Vector3(-100, 0, 80),
            new THREE.Vector3(-120, 0, 70),
            new THREE.Vector3(-140, 0, 70),
            new THREE.Vector3(-180, 0, 50),
            new THREE.Vector3(-140, 0, 0),
        ]);

        curve.closed = true;
        return curve;
    }

    // This method will build the track
    buildTrack(){
        this.createTrackMaterials();
        this.createTrackObjects();
    }

    // This method will create the materials for the track
    createTrackMaterials(){
        const texture = new THREE.TextureLoader().load( './textures/race_track.jpg');
        texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({color: '#ffffff', map: texture});
        this.material.map.repeat.set(3,3);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;

        this.wire_frame_material = new THREE.MeshPhysicalMaterial({color: "#000000", opacity: 0.3,wireframe: true});

        this.line_material = new THREE.LineBasicMaterial({color: "#ff0000"});
    }

    // This method will create the track objects
    createTrackObjects(){
        this.track_geometry = new THREE.TubeGeometry(this.path, this.segments, this.width, 8, this.closed_curve);
        this.mesh = new THREE.Mesh(this.track_geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;

        this.wireframe = new THREE.Mesh(this.track_geometry, this.wire_frame_material);

        let points = this.path.getPoints(this.segments);
        let line_geometry = new THREE.BufferGeometry().setFromPoints(points);

        this.line = new THREE.Line(line_geometry, this.line_material);

        this.mesh.visible = this.show_mesh;
        this.wireframe.visible = this.show_wireframe;
        this.line.visible = this.show_line;

        this.add(this.mesh);
        this.add(this.wireframe);
        this.add(this.line);

        this.scale.set(1,0.001,1);
    }

    /**
     * Called when user changes number of segments in UI. Recreates the curve's objects accordingly.
     */
    updateCurve() {
        if (this.curve !== undefined && this.curve !== null) {
        this.app.scene.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Called when user curve's closed parameter in the UI. Recreates the curve's objects accordingly.
     */
    updateCurveClosing() {
        if (this.curve !== undefined && this.curve !== null) {
        this.app.scene.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Called when user changes number of texture repeats in UI. Updates the repeat vector for the curve's texture.
     * @param {number} value - repeat value in S (or U) provided by user
     */
    updateTextureRepeat(value) {
        this.material.map.repeat.set(value, 3);
    }

    /**
     * Called when user changes line visibility. Shows/hides line object.
     */
    updateLineVisibility() {
        this.line.visible = this.show_line;
    }
    
    /**
     * Called when user changes wireframe visibility. Shows/hides wireframe object.
     */
    updateWireframeVisibility() {
        this.wireframe.visible = this.show_wireframe;
    }

    /**
     * Called when user changes mesh visibility. Shows/hides mesh object.
     */
    updateMeshVisibility() {
        this.mesh.visible = this.show_mesh;
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     */
    update() {}


}