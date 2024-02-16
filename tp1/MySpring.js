import * as THREE from 'three';


export class MySpring extends THREE.Mesh{

    constructor(radius, thickness, height, thetaEnd, segments) {
        const theta1 = (3 * Math.PI / 2)
        const heightStep = height / thetaEnd;

        const curve = new THREE.Curve();
        curve.getPoint = function (t) {
            const theta = THREE.MathUtils.lerp(0, thetaEnd, t);
            const x = radius * Math.cos(theta);
            const y = Math.max(t * thetaEnd - theta1, 0) * heightStep;
            const z = radius * Math.sin(theta);
            return new THREE.Vector3(x, y, z);
        };

        const geometry = new THREE.TubeGeometry(curve, segments, thickness, 8, false);
        
        const lineMaterial = new THREE.MeshPhysicalMaterial({ color: "#ff21da", metalness: 1, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
        super(geometry, lineMaterial);
     }
}