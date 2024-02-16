import * as THREE from 'three';
import { MyParticle } from './MyParticle.js';

/**
 * This class represents a fireworks
 */
class MyFireworks {
    constructor(scene, startPosition, explosionPosition, numberOfParticles, timeToExplode, lifespan) {
        this.scene = scene;

        // The position where the fireworks starts
        this.startPosition = startPosition;

        // The position where the fireworks explodes
        this.explosionPosition = explosionPosition;

        // The time it takes for the fireworks to explode
        this.timeToExplode = timeToExplode;

        // The number of particles in the explosion
        this.numberOfParticles = numberOfParticles;

        // The lifespan of the particles
        this.lifespan = lifespan;
        this.particles = [];

        // Create the particle mesh
        this.particleMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );

        // Create the intermediate particle mesh
        this.intermediateParticleMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.075, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );

        this.createParticles();
    }

    /**
     * Creates the particle that will explode
     */
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            const particle = new MyParticle(this.scene, this.particleMesh.clone(), this.lifespan);

            particle.mesh.position.copy(this.explosionPosition);

            // Create the path function for the particle (that is, its trajectory)
            particle.setPathFunction((t) => {
                const x = this.explosionPosition.x + t * Math.sin((Math.PI * 2) * (i / this.numberOfParticles)) * 5;
                const y = this.explosionPosition.y + t * Math.cos((Math.PI * 2) * (i / this.numberOfParticles)) * 5;
                const z = this.explosionPosition.z;

                // Create intermediate particles
                if(t % 0.05 == 0 || t % 0.045 == 0 || t % 0.04 == 0){
                    const intermediateParticle = new MyParticle(this.scene, this.intermediateParticleMesh.clone(), this.lifespan);
                    intermediateParticle.mesh.position.copy(particle.mesh.position);

                    // Trajectory of the intermediate particles
                    intermediateParticle.setPathFunction((t) => {
                        const x = this.explosionPosition.x + t * Math.sin((Math.PI * 2) * (i / this.numberOfParticles)) * 5;
                        const y = this.explosionPosition.y + t * Math.cos((Math.PI * 2) * (i / this.numberOfParticles)) * 5;
                        const z = this.explosionPosition.z;

                        return new THREE.Vector3(x, y, z);
                    });

                    // Fade out the intermediate particles
                    intermediateParticle.setTransparencyFunction((t) => 1 - t);
                    this.particles.push(intermediateParticle);
                    intermediateParticle.start();
                }

                return new THREE.Vector3(x, y, z);
            });

            // Color of the particles
            particle.setColorFunction((t) => {
                const color = new THREE.Color();
                color.setHSL(t, 1, 0.5);

                return color;
            });

            // Fade out the particles
            particle.setTransparencyFunction((t) => 1 - t);

            this.particles.push(particle);
        }
    }

    /**
     * Starts the fireworks
     */
    start() {
        const startParticle = new MyParticle(this.scene, this.particleMesh.clone(), this.timeToExplode);
        startParticle.mesh.position.copy(this.startPosition);
    
        // Create the path function for the particle (that is, its trajectory)
        startParticle.setPathFunction((t) => {
            const x = this.startPosition.x + t * (this.explosionPosition.x - this.startPosition.x);
            const y = this.startPosition.y + t * (this.explosionPosition.y - this.startPosition.y);
            const z = this.startPosition.z + t * (this.explosionPosition.z - this.startPosition.z);
    
            return new THREE.Vector3(x, y, z);
        });
    
        // Color of the particles
        startParticle.setColorFunction((t) => {
            const color = new THREE.Color();
            color.setHSL(t, 1, 0.5);
    
            return color;
        });

        // If the start particle dies, explode
        startParticle.onDeath = () => {
            this.explode();
        };
    
        this.particles.push(startParticle);
        startParticle.start();
    }

    /**
     * Explodes the fireworks
     */
    explode() {
        this.particles.forEach((particle) => {
            particle.start();
        });
    }

    /**
     * Updates the particles
     */
    update() {
        this.particles.forEach((particle) => {
            particle.update();
        });
    }

    /**
     * @returns true if all the particles are dead
     */
    isDead() {
        return this.particles.every((particle) => particle.isDead());
    }
}

export { MyFireworks };
