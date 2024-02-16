import * as THREE from 'three';

/**
 * This class represents the checkpoints of the game
 */
class MyCheckpoints {

    constructor(scene, laps) {
        this.scene = scene;
        this.laps = laps;
        this.checkpoints = [];

        // Checkpoint's positions and rotations
        this.points = [
            {
                position: new THREE.Vector3( 91.204, 0.00995, 140.495 ),
                rotation: Math.PI / 7
            },
            {
                position: new THREE.Vector3( 0, 0, 0 ),
                rotation: Math.PI / 2
            },
        ];

        this.setupCheckpoints();
        this.totalCheckpoints = this.checkpoints.length * this.laps;
        
    }

    /**
     * Loads the checkpoints into the scene
     */
    setupCheckpoints(){
        this.points.forEach((point, index) => {
            const geometry = new THREE.BoxGeometry( 40, 10, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
            const box = new THREE.Mesh( geometry, material );
            box.position.copy(point.position);
            box.rotateY(point.rotation);
            //this.scene.add( box );
            this.checkpoints.push(box);
        });
    }

    /**
     * Returns the current lap of the car based on the current checkpoint
     * @param {*} currentCheckpoint 
     * @returns 
     */
    getCurrentLap(currentCheckpoint){
        if(this.checkpoints.length == 0)
            return 0;
        console.log("Current lap: " + Math.floor((currentCheckpoint + 1) / this.checkpoints.length));
        return Math.floor((currentCheckpoint + 1) / this.checkpoints.length) + 1;
    }

    /**
     * Returns the next checkpoint
     * @param {*} currentCheckpoint 
     * @returns 
     */
    nextCheckpoint(currentCheckpoint){
        return this.checkpoints[(currentCheckpoint + 1) % this.checkpoints.length];
    }

    /**
     * Verifies if the car has passed the last checkpoint
     * @param {*} currentCheckpoint 
     * @returns 
     */
    isLastCheckpoint(currentCheckpoint){
        return currentCheckpoint === this.totalCheckpoints - 1;
    }
}

export { MyCheckpoints };