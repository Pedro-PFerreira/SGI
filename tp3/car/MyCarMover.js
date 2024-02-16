import * as THREE from 'three';

/**
 * This class moves the car
 */
export class MyCarMover extends THREE.Group {

    constructor(car) {
        super();
        this.car = car;

        // Starting flag
        this.started = false;

        // Car's steering-related variables
        this.max_steering = 0.05;
        this.steering_factor = 0;
        this.steering_wheel_rot = Math.PI / 4;
        this.steering_accel = 0.004;

        // Car's speed-related variables
        this.current_speed = 0;
        this.maximum_speed = 0.5;
        this.minimum_speed = -0.2;
        this.acceleration = 0.01;
        this.brake_acceleration = 0.005;
        this.deacceleration = 0.0015;
    }

    start() {
        this.started = true;
    }

    // This method will move the car through the keyboard
    move(keys){
        if (!this.started) return;

        keys.forEach(key => {
            switch(key){
                case "w":
                case "W":
                    this.current_speed += this.acceleration;
                    break;
                case "s":
                case "S":
                    this.current_speed -= this.brake_acceleration;                    
                    break;
                case "a":
                case "A":
                    this.steering_factor += this.steering_accel;
                    break;
                case "d":
                case "D":
                    this.steering_factor -= this.steering_accel;
                    break;         
                default:
                    break;
            }
        });
    }

    /**
     * Updates the car's position and rotation in the scene
     * @returns 
     */
    update() {
        if (!this.started) return;
        
        // Update the car's position
        this.car.mesh.translateZ(this.current_speed * this.car.getSpeedPercent());
    
        // Update the car's rotation
        if (this.current_speed !== 0) {
            // Rotate the car group
            this.car.mesh.rotateY(this.steering_factor * this.car.getSpeedPercent());
        }
    
        // Update the car's speed
        this.current_speed = Math.max(Math.min(this.current_speed, this.maximum_speed), this.minimum_speed);

        // Update the car's steering
        this.steering_factor = Math.max(Math.min(this.steering_factor, this.max_steering), -this.max_steering);

        // Checks if the car is outside the track
        this.car.currentSpeed = (this.car.outsideTrack ? 0.7 : this.car.speedPercent) * this.car.maxSpeed * (this.current_speed / this.maximum_speed);

        // Update the car's steering wheels
        if (this.car.frontTireL && this.car.frontTireR){
            this.car.frontTireL.rotation.set(0, this.steering_wheel_rot * ((this.steering_factor / this.max_steering)) + 0.001, 0);
            this.car.frontTireR.rotation.set(0, this.steering_wheel_rot * ((this.steering_factor / this.max_steering)) + 0.001, 0);
        }

        // Physics
        if (this.current_speed > 0) {
            this.current_speed = Math.max(this.current_speed - this.deacceleration, 0) ;
        } else if (this.current_speed < 0) {
            this.current_speed = Math.min(this.current_speed + this.deacceleration, 0);
        }
    
        // Reduce the steering factor's speed if no key is pressed
        if (this.steering_factor > 0){
            if(this.current_speed !== 0) {
                this.steering_factor -= this.deacceleration;
                return;
            }
        }
        
        // Reduce the steering factor's speed if no key is pressed
        else if (this.steering_factor < 0){
            this.car.frontTireL.rotateY(this.steering_factor);
            if(this.current_speed !== 0) {
                this.steering_factor += this.deacceleration;
                return;
            }
        }
    }
}