import * as THREE from 'three';

class MyLapCounter {
    constructor(app, scene, car, checkpoints) {
        this.scene = scene;
        this.car = car;
        this.checkpoints = checkpoints;
        this.started = false;
        this.speedElement = document.getElementById('lapCounter-container');
        this.laps = 3;
    }

    start(){
        this.started = true;
    }

    update() {
        if(!this.started) return;
        
        this.speedElement.innerText = `Laps: ${this.checkpoints.getCurrentLap(this.car.currentCheckpoint)}/${this.laps}`;
    }
}

export { MyLapCounter };
