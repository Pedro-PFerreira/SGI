import * as THREE from 'three';
import { MyCandle } from './MyCandle.js';

export class MyCake extends THREE.Group {
    constructor(radius, height){
        super();

        this.radius = radius;
        this.height = height;

        this.makeCake();
        this.makePlate();
        
    }   

    makePlate(){

        const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const PlaneGeometry = new THREE.CylinderGeometry(0.8,0.2, 0.1, 32);

        this.plateMesh = new THREE.Mesh(PlaneGeometry, plateMaterial);
        this.plateMesh.position.set(0, 2.3, 0);
        this.plateMesh.receiveShadow = true;
        this.plateMesh.castShadow = true;
        
        this.add(this.plateMesh);
        
    }
    
    makeCake(){
        const cakeMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
        const sliceMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700, side: THREE.DoubleSide });
        const cakeGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, 2*Math.PI - Math.PI / 3);
        this.cakeMesh = new THREE.Mesh(cakeGeometry, cakeMaterial);
        this.cakeMesh.castShadow = true;
        this.cakeMesh.receiveShadow = true;
        this.cakeGroup = new THREE.Group(); 

        this.initSlice = new THREE.PlaneGeometry(this.height, this.radius);
        this.initSliceMesh = new THREE.Mesh(this.initSlice, sliceMaterial);
        this.initSliceMesh.translateX(this.radius / 2);
        const initSliceGroup = new THREE.Group();
        initSliceGroup.add(this.initSliceMesh);
        initSliceGroup.rotation.set(0, -Math.PI / 2, 0);
        

        this.endSlice = new THREE.PlaneGeometry(this.height, this.radius);
        this.endSliceMesh = new THREE.Mesh(this.endSlice, sliceMaterial);
        this.endSliceMesh.translateX(this.radius / 2);
        const endSliceGroup = new THREE.Group();
        endSliceGroup.add(this.endSliceMesh);
        endSliceGroup.rotation.set(0, -Math.PI / 2 + (2*Math.PI - Math.PI / 3), 0);

        this.cakeGroup.add(this.cakeMesh);
        this.cakeGroup.add(initSliceGroup);
        this.cakeGroup.add(endSliceGroup);

        this.candle = new MyCandle();

        this.cakeGroup.add(this.candle);
        this.cakeGroup.position.set(0, 2.5, 0);

        this.add(this.cakeGroup);



    }
}