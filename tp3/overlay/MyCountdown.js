import * as THREE from 'three';

class MyCountdown {
    constructor(app, scene) {
        this.scene = scene;
        this.camera = app.getActiveCamera();

        this.started = false;
        this.startTime = 0;
        this.countdownDuration = 3; // Countdown from 3 seconds
        this.remainingTime = this.countdownDuration;

        this.timerElement = document.getElementById('countdown-timer-container');
    }

    async run() {
        if (!this.started) {
            this.startTime = Date.now();
            this.started = true;
        }

        const elapsedTimeMillis = Date.now() - this.startTime;
        const elapsedSeconds = Math.floor(elapsedTimeMillis / 1000);
        this.remainingTime = this.countdownDuration - elapsedSeconds;

        if (this.remainingTime <= 0) {
            this.remainingTime = 0;
            this.started = false;
            this.timerElement.innerText = 'GO!';

            setTimeout(() => {
                this.timerElement.style.display = 'none';
            }, 1000);
        } 
        
        else 
            this.timerElement.innerText = this.remainingTime;

        if (this.started) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pause execution for 1 second
            return this.run();
        }

        return;
    }
}

export { MyCountdown };
