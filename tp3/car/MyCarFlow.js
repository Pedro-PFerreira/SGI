import * as THREE from 'three';

/**
 * This class moves the car along the track autonomously
 */
export class MyCarFlow extends THREE.Group {

    constructor(car) {
        super();

    
        this.t = 0;
        this.offset = Math.random() * 16 - 8;
        this.car = car;

        // Starting flag
        this.started = false;

        // Trajectory
        this.curve = this.makeCurve();
        this.lapTime = 45000;
        this.startTime = 0;
    }

    setLapTime(lapTime){
        this.lapTime = lapTime;
    }

    /**
     * Defines the curve for the car to follow
     * @returns 
     */
    makeCurve() {

        // Points for the curve
        this.points = [
            new THREE.Vector3(0, 0, 2.5),
            new THREE.Vector3(51.93767708115849, 0.009980775682000967, -2.5833162462605284),
            new THREE.Vector3(103.81514790431653, 0.007457865016811411, 2.931659074519544),
            new THREE.Vector3(133.25763420240233, 0.008360758895854815, 7.784226050652103),
            new THREE.Vector3(148.32367940550222, 0.009737431346462473, 7.142542017884721),
            new THREE.Vector3(167.3186038904404, 0.008102212873149255, -8.724253498063272),
            new THREE.Vector3(200.0056082143742, 0.008776586731295537, -14.595459657864037),
            new THREE.Vector3(218.72693657968568, 0.009931612848602526, 35.13760866398904),
            new THREE.Vector3(230.8385516843599, 0.00999576418635479, 98.83654282997735),
            new THREE.Vector3(255.29912762732084, 0.00989736744824404, 170.9509812848229),
            new THREE.Vector3(275.0983722489511, 0.00832784226147851, 221.23033021794248),
            new THREE.Vector3(293.1612855946029, 0.007264293748972705, 272.4566844659376),
            new THREE.Vector3(295.2523032802722, 0.00733973659795447, 294.5753438259107),
            new THREE.Vector3(275.2824914112725, 0.009405563762129532, 310.3544848192335),
            new THREE.Vector3(233.74715279995556, 0.00967943883634598, 313.87475381941096),
            new THREE.Vector3(192.40810753793806, 0.007534039261896396, 296.3463355921218),
            new THREE.Vector3(150.40593071107435, 0.005695113700308866, 240.198289494475),
            new THREE.Vector3(116.14614625610754, 0.0077685522684842, 181.82113362452662),
            new THREE.Vector3(81.88823933021759, 0.008221334520587334, 131.25693112290415),
            new THREE.Vector3(63.19128603858841, 0.007489949364200584, 101.4957902260035),
            new THREE.Vector3(42.128423583917545, 0.0093487214834895, 104.75122011437006),
            new THREE.Vector3(-4.104252989915828, 0.009974636305041713, 89.44382733055788),
            new THREE.Vector3(-69.29086066640335, 0.009448275919188745, 82.80574294324971),
            new THREE.Vector3(-133.98373254059678, 0.008712730414928956, 66.92063631986524),
            new THREE.Vector3(-173.09381013244646, 0.008823445075593555, 60.34372335111484),
            new THREE.Vector3(-175.1122318394452, 0.009824777829573578, 33.443277513649655),
            new THREE.Vector3(-129.15162178844818, 0.007328537958695961, 3.241487951284979),
            new THREE.Vector3(-64.66791385333575, 0.009518425850568746, -3.4706720819556054),
        ];
    
        const curve = new THREE.CatmullRomCurve3(this.points);
        curve.closed = true;
        return curve;
    }

    /**
     * Adds points to the scene for debugging purposes
     */
    showPoints(){
        this.points.forEach(point => {
            const geometry = new THREE.SphereGeometry(1.5, 16, 16);
            const material = new THREE.MeshBasicMaterial({color: "#00ffff"});
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(...point.toArray());
            this.add(sphere);
        });
    }

    /**
     * Starts the movement of the car
     * @returns 
     */
    start() {
        if (this.started) return;

        this.car.mesh.position.set(...this.curve.getPoint(0).toArray());
        this.car.mesh.lookAt(this.curve.getPoint(0.001));
        this.started = true;
        this.startTime = Date.now();
    }

    /**
     * Updates the position of the car
     * @returns 
     */
    update() {
        if (!this.started) return;
    
        this.t = (Date.now() - this.startTime) / this.lapTime;

        this.car.mesh.position.set(...this.curve.getPoint(this.t).toArray());
        this.car.mesh.lookAt(this.curve.getPoint((this.t + 0.001) % 1));
    }
    
}