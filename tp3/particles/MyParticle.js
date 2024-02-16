/**
 * This class represents a particle 
 */
class MyParticle {
    constructor(scene, mesh, lifespan) {
        this.scene = scene;
        this.mesh = mesh;

        // Lifespan of the particle
        this.lifespan = lifespan;
        this.pathFunction = (t) => this.mesh.position; // function that takes in a t value between 0 and 1 and returns a THREE.Vector3
        this.colorFunction = (t) => this.mesh.material.color; // function that takes in a t value between 0 and 1 and returns a THREE.Color
        this.transparencyFunction = (t) => 1; // function that takes in a t value between 0 and 1 and returns a number between 0 and 1
        this.onDeath = () => {return}; // function that is called when the particle dies

        // Attributes related to the particle's life
        this.lifeMoment = 0;
        this.t = 0;
        this.alive = false;
    }

    /**
     * Starts the particle lifecycle
     */
    start() {
        this.alive = true;
        this.scene.add(this.mesh);
    }

    /**
     * Defines the trajectory of the particle
     * @param {*} pathFunction 
     */
    setPathFunction(pathFunction) {
        this.pathFunction = pathFunction;
    }

    /**
     * Sets the color of the particle
     * @param {*} colorFunction 
     */
    setColorFunction(colorFunction) {
        this.colorFunction = colorFunction;
    }

    /**
     * Sets the fade out of the particle
     * @param {*} transparencyFunction 
     */
    setTransparencyFunction(transparencyFunction) {
        this.mesh.material.transparent = true;
        this.transparencyFunction = transparencyFunction;
    }

    /**
     * Updates the particle in the scene
     * @returns 
     */
    update() {
        if(!this.alive) return;
        
        // If the particle is dead, remove it from the scene
        if(this.isDead()) {
            this.destroy();
            return;
        }

        // Update the particle life's attributes
        this.lifeMoment += 1;
        this.t = this.lifeMoment / this.lifespan;
        this.mesh.position.copy(this.pathFunction(this.t));
        this.mesh.material.color.copy(this.colorFunction(this.t));
        this.mesh.material.opacity = this.transparencyFunction(this.t);
    }

    /**
     * @returns true if the particle is dead
     */
    isDead() {
        return this.lifeMoment >= this.lifespan;
    }

    /**
     * Destroys the particle
     */
    destroy() {
        this.alive = false;
        this.onDeath();
        this.scene.remove(this.mesh);
    }
}

export { MyParticle };