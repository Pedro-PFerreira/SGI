class MyStopwatch {
    constructor(app, scene) {
        this.scene = scene;
        this.camera = app.getActiveCamera();

        this.started = false;
        this.startTime = 0;
        this.elapsedTime = 0;

        this.stopwatchElement = document.getElementById('stopwatch-container');

        window.addEventListener('resize', () => this.onWindowResize());
    }

    start() {
        this.startTime = Date.now();
        this.started = true;
    }

    stop(){
        this.started = false;
    }

    pause() {
        this.pauseTime = Date.now();
    }

    resume() {
        this.startTime += Date.now() - this.pauseTime;
    }

    getTime() {
        return Date.now() - this.startTime;
    }

    incrementTime(seconds) {
        this.startTime -= seconds;
        
        this.update();
    }

    decrementTime(seconds) {
        
        this.startTime += seconds;
        if (this.elapsedTime < 0) {
            this.elapsedTime = 0;
        }
        this.update();
    }

    update() {
        if (!this.started) return;

        const elapsedTimeMillis = Date.now() - this.startTime;
        this.elapsedTime = Math.floor(elapsedTimeMillis / 1000);
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        const milliseconds = String(elapsedTimeMillis % 1000).padStart(3, '0');
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${milliseconds}`;
        this.stopwatchElement.innerText = `Time: ${formattedTime}`;
    }

    getElapsedTime() {
        return this.elapsedTime;
    }

    onWindowResize() {
        // Handle window resize if needed
    }
}


export { MyStopwatch };
