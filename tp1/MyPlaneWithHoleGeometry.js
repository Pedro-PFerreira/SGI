import * as THREE from 'three';

export class MyPlaneWithHoleGeometry extends THREE.BufferGeometry {
    constructor(width, height, holeWidth, holeHeight, centerX, centerY) {
        super();

        // Calculate half sizes
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const halfHoleWidth = holeWidth / 2;
        const halfHoleHeight = holeHeight / 2;

        // Define vertices for the outer plane
        const vertices = new Float32Array([
            -halfWidth, halfHeight, 0,     // 0 Top-left
            halfWidth, halfHeight, 0,      // 1 Top-right
            halfWidth, -halfHeight, 0,     // 2 Bottom-right
            -halfWidth, -halfHeight, 0,    // 3 Bottom-left

            centerX - halfHoleWidth, centerY + halfHoleHeight, 0,  // 4 Hole Top-left
            centerX + halfHoleWidth, centerY + halfHoleHeight, 0,  // 5 Hole Top-right
            centerX + halfHoleWidth, centerY - halfHoleHeight, 0,  // 6 Hole Bottom-right
            centerX - halfHoleWidth, centerY - halfHoleHeight, 0,  // 7 Hole Bottom-left
        ]);

        const uvs = new Float32Array([
            0, 1,
            1, 1,
            1, 0,  
            0, 0,
            (centerX - halfHoleWidth + halfWidth) / width, (centerY + halfHoleHeight + halfHeight) / height,
            (centerX + halfHoleWidth + halfWidth) / width, (centerY + halfHoleHeight + halfHeight) / height,   
            (centerX + halfHoleWidth + halfWidth) / width, (centerY - halfHoleHeight + halfHeight) / height,   
            (centerX - halfHoleWidth + halfWidth) / width, (centerY - halfHoleHeight + halfHeight) / height
        ]);

        // Create buffer attributes
        this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        
        // Create faces
        const indices = [
            0, 4, 1,
            1, 4, 5,
            1, 5, 2,
            2, 5, 6,
            2, 6, 3,
            3, 6, 7,
            3, 7, 0,
            0, 7, 4
        ];

        this.setIndex(indices);
        this.computeVertexNormals();
    }
}
