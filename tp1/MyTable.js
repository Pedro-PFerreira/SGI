import * as THREE from 'three';

export class MyTable extends THREE.Group {
    constructor(topWidth, topLength, topHeight, legRadius, legHeight){
        super();

        this.topWidth = topWidth;
        this.topLength = topLength;
        this.topHeight = topHeight;
        this.legRadius = legRadius;
        this.legHeight = legHeight;

        const topGeometry = new THREE.BoxGeometry(this.topWidth, this.topHeight, this.topLength);

        const topTexture = new THREE.TextureLoader().load('textures/table.jpg');
        topTexture.wrapS = THREE.RepeatWrapping;
        topTexture.wrapT = THREE.RepeatWrapping;
        topTexture.repeat.set(1,1);

        const topMaterial = new THREE.MeshPhysicalMaterial({ color: '#D3D3D3', map: topTexture,
        emissive:"#000000"});
        
        this.topMesh = new THREE.Mesh(topGeometry, topMaterial);
        this.topMesh.receiveShadow = true;
        this.topMesh.castShadow = true;
        this.topMesh.position.set(0, this.legHeight + this.topHeight / 2, 0);
        this.add(this.topMesh);

        const legGeometry = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight, 16);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x884422,
            specular:"#C4A484", emissive:"#000000", shininess: 90 });

        this.legMesh1 = new THREE.Mesh(legGeometry, legMaterial);
        this.legMesh2 = new THREE.Mesh(legGeometry, legMaterial);
        this.legMesh3 = new THREE.Mesh(legGeometry, legMaterial);
        this.legMesh4 = new THREE.Mesh(legGeometry, legMaterial);

        this.legMesh1.position.set(this.topWidth / 2.7, this.legHeight / 2, this.topLength / 2.7);
        this.legMesh2.position.set(-this.topWidth / 2.7, this.legHeight / 2, -this.topLength / 2.7);
        this.legMesh3.position.set(-this.topWidth / 2.7, this.legHeight / 2, this.topLength / 2.7);
        this.legMesh4.position.set(this.topWidth / 2.7, this.legHeight / 2, -this.topLength / 2.7);

        this.legMesh1.castShadow = true;
        this.legMesh2.castShadow = true;
        this.legMesh3.castShadow = true;
        this.legMesh4.castShadow = true;
        this.legMesh1.receiveShadow = true;
        this.legMesh2.receiveShadow = true;
        this.legMesh3.receiveShadow = true;
        this.legMesh4.receiveShadow = true;
        
        this.add(this.legMesh1);
        this.add(this.legMesh2);
        this.add(this.legMesh3);
        this.add(this.legMesh4);
    }
}