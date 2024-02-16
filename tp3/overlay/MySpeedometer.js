import * as THREE from 'three';

class MySpeedometer {
    constructor(app, scene, car) {
        this.scene = scene;
        this.car = car;
        this.started = false;
        this.speedElement = document.getElementById('speedometer-container');
    }

    start(){
        this.started = true;

    }

    update() {
        if(!this.started) return;

        // Convert speeed to int and update the speedometer
        
        this.speedElement.innerText = `Speed: ${Math.round(this.car.currentSpeed)} km/h`;
    }
}

export { MySpeedometer };
