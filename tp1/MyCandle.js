import * as THREE from 'three';

export class MyCandle extends THREE.Group {

    constructor(){
        super();

        this.candleHeight = 0.15;
        this.candleRadius = 0.015;

        this.candleMesh = null;
        this.candleMeshSize = 1.0;
        this.candleEnabled = true;
        this.candleBoxEnabled = null;

        this.lightMesh = null;
        this.lightMeshSize = 1.0;
        this.lightEnabled = true;
        this.lightBoxEnabled = null;
    
        this.buildCandle();
    
    }

    // Builds the candle mesh with material assigned
    buildCandle(){

        const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xff44ff,
        specular: "#000000", emissive: "#000000", shininess: 90 });
        candleMaterial.side = THREE.DoubleSide;

        const lightMaterial = new THREE.MeshPhongMaterial({ color: 0xe25822,
        specular: "#000000", emissive: "#000000", shininess: 90 });
        lightMaterial.side = THREE.DoubleSide;


        let candle = new THREE.CylinderGeometry(this.candleRadius, this.candleRadius, this.candleHeight, 32);
        this.candleMesh = new THREE.Mesh(candle, candleMaterial);

        this.candleMesh.position.set(0,0.25,0);

        let light = new THREE.ConeGeometry(this.candleRadius * 1.5, 0.025, 32);
        this.lightMesh = new THREE.Mesh(light, lightMaterial);
        this.lightMesh.position.set(0,0.33,0);

        this.add(this.candleMesh);
        this.add(this.lightMesh);

    }

}
