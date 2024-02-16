import * as THREE from 'three';
import { MyPlaneWithHoleGeometry } from './MyPlaneWithHoleGeometry.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { MyGlassPane } from './MyGlassPane.js';

export class MyRoom extends THREE.Group{

    constructor() {
        super();
   
        this.wall1Mesh = null;
        this.wall2Mesh = null;
        this.wall3Mesh = null;
        this.wall4Mesh = null;

        this.roomMesh = null;
        this.roomMeshSize = 1.0;
        this.roomEnabled = true;
        this.roomBoxEnabled = null;
        this.roomDisplacement = new THREE.Vector3(0,2,0);

        this.floorTexture = new THREE.TextureLoader().load('textures/wood_floor.jpg'),

        this.roomMaterial = new THREE.MeshPhysicalMaterial({color: "#840000",
        specular: "#000000", shininess: 90});

        this.buildRoom();

    }

    // Builds the room mesh with material assigned
    buildRoom(){

        const width = 15;      
        const height = 10;     
        const holeWidth = 5;  
        const holeHeight = 7; 
        const centerX = 0;    
        const centerY = 0;    

        const wall1 = new THREE.BoxGeometry(width, height, 0.1);
        this.wall1Mesh = new THREE.Mesh(wall1, this.roomMaterial);
        this.wall1Mesh.position.set(0,5,7.5);

        const wall2 = new MyPlaneWithHoleGeometry(width, height, holeWidth, holeHeight, centerX, centerY);
        this.wall2Mesh = new THREE.Mesh(wall2, this.roomMaterial);
        this.wall2Mesh.position.set(0,5,-7.5);

        this.windowGlass = new MyGlassPane(holeWidth, holeHeight);
        this.windowGlass.position.set(0,5,-7.5);
        this.add(this.windowGlass);

        const wall3 = new THREE.BoxGeometry(width, height, 0.1);
        this.wall3Mesh = new THREE.Mesh(wall3, this.roomMaterial);
        this.wall3Mesh.position.set(7.5,5,0);
        this.wall3Mesh.rotation.y = THREE.MathUtils.degToRad(90);

        const wall4 = new THREE.BoxGeometry(width, height, 0.1);
        this.wall4Mesh = new THREE.Mesh(wall4, this.roomMaterial);
        this.wall4Mesh.position.set(-7.5,5,0);
        this.wall4Mesh.rotation.y = THREE.MathUtils.degToRad(90);


        // Creation of the room's roof
        let roof = new THREE.BoxGeometry(width, width, 0.1);
        this.roofMesh = new THREE.Mesh(roof, this.roomMaterial);
        this.roofMesh.castShadow = true;
        this.roofMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        this.roofMesh.position.set(0,9.95,0);


        // Add all the elements to the group
        // Create 2 picture frames on the walls
        const pictureFrame1 = new THREE.BoxGeometry(2.75, 3.5, 0.05);
        const pictureFrame2 = new THREE.BoxGeometry(2.75, 3.5, 0.05);
    
        const tex1 = new THREE.TextureLoader().load('textures/pedro_ferreira.jpeg');
        const tex2 = new THREE.TextureLoader().load('textures/lourenco_goncalves.jpg');
    
    
        const pictureFrameMaterial1 = new THREE.MeshPhongMaterial({ color: "#ffffff",
        shininess: 90,
        emissive: 40 , map: tex1});
        const pictureFrameMaterial2 = new THREE.MeshPhongMaterial({ color: "#ffffff",
        emissive: 1.0 , map: tex2});
        const pictureFrameMesh1 = new THREE.Mesh(pictureFrame1, pictureFrameMaterial1);
        const pictureFrameMesh2 = new THREE.Mesh(pictureFrame2, pictureFrameMaterial2);

        pictureFrameMesh1.position.set(3, 5.5, 7.4);
        pictureFrameMesh2.position.set(-3, 5.5, 7.4);

        pictureFrameMesh1.receiveShadow = true;
        pictureFrameMesh2.receiveShadow = true;

        const pictureFrameBorder1 = new THREE.PlaneGeometry(3.25, 4, 5, 5);
        const pictureFrameBorder2 = new THREE.PlaneGeometry(3.25, 4, 5, 5);

        const pictureFrameBorderTexture = new THREE.TextureLoader().load('textures/border_texture.png');
        pictureFrameBorderTexture.wrapS = THREE.ClampingtoEdge;
        pictureFrameBorderTexture.wrapT = THREE.ClampingtoEdge;


        const pictureFrameBorderMaterial = new THREE.MeshStandardMaterial({
            color: "#FFD700",
            metalness: 0.9,
            roughness: 0.5,
            map: pictureFrameBorderTexture
        });

        pictureFrameBorderMaterial.side = THREE.DoubleSide;

        const pictureFrameBorderMesh1 = new THREE.Mesh(pictureFrameBorder1, pictureFrameBorderMaterial);
        const pictureFrameBorderMesh2 = new THREE.Mesh(pictureFrameBorder2, pictureFrameBorderMaterial);

        pictureFrameBorderMesh1.receiveShadow = true;
        pictureFrameBorderMesh2.receiveShadow = true;

        pictureFrameBorderMesh1.position.set(3, 5.5, 7.4);
        pictureFrameBorderMesh2.position.set(-3, 5.5, 7.4);      

        this.add(pictureFrameBorderMesh1);
        this.add(pictureFrameBorderMesh2);
        this.add(pictureFrameMesh1);
        this.add(pictureFrameMesh2);
        
        // Create an inverted half sphere 
        const invertedHalfSphere = new THREE.SphereGeometry(50, 32, 32);
        const invertedHalfSphereTexture = new THREE.TextureLoader().load('textures/panorama2.jpg');
        const invertedHalfSphereMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", side: THREE.BackSide,
        specular: "#000000", shininess: 90, map: invertedHalfSphereTexture});
        const invertedHalfSphereMesh = new THREE.Mesh(invertedHalfSphere, invertedHalfSphereMaterial);
        invertedHalfSphereMesh.position.set(0, 3, 0);
        invertedHalfSphereMesh.rotation.y = Math.PI/2;
        this.add(invertedHalfSphereMesh);

        // Create spotlight to iluminate the panorama
        this.spotLight = new THREE.SpotLight( 0xffffff, 10, 50, Math.PI/2, 0, 0 );
        this.spotLight.position.set( 0,5,-8.5 );
        this.spotLight.target.position.set(0,5,-10);
        this.add(this.spotLight);

        // Spotlight helper
        this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        //this.add( this.spotLightHelper );

        // window frame
        const frameWidth = 0.5;

        const boxGeometry1 = new THREE.BoxGeometry(0.5, holeHeight - frameWidth, 0.5);
        const boxGeometry2 = new THREE.BoxGeometry(holeWidth + frameWidth, 0.5, 0.5);
        const boxMaterial = new THREE.MeshPhongMaterial({ color: "#D4AF37",
        specular: "#000000", shininess: 90 });

        this.box1Mesh = new THREE.Mesh(boxGeometry1, boxMaterial);
        this.box1Mesh.castShadow = true;
        this.box1Mesh.receiveShadow = true;
        this.box1Mesh.position.set(-5 + holeWidth / 2 ,5,-7.5);
        this.add(this.box1Mesh);
        this.box2Mesh = new THREE.Mesh(boxGeometry1, boxMaterial);
        this.box2Mesh.castShadow = true;
        this.box2Mesh.receiveShadow = true;
        this.box2Mesh.position.set(5 - holeWidth / 2 ,5,-7.5);
        this.add(this.box2Mesh);

        this.box3Mesh = new THREE.Mesh(boxGeometry2, boxMaterial);
        this.box3Mesh.castShadow = true;
        this.box3Mesh.receiveShadow = true;
        this.box3Mesh.position.set(0, 5 + holeHeight / 2, -7.5);
        this.add(this.box3Mesh);
        this.box4Mesh = new THREE.Mesh(boxGeometry2, boxMaterial);
        this.box4Mesh.castShadow = true;
        this.box4Mesh.receiveShadow = true;
        this.box4Mesh.position.set(0, 5 - holeHeight / 2, -7.5);
        this.add(this.box4Mesh);

        this.wall1Mesh.castShadow = true;
        this.wall1Mesh.receiveShadow = true;

        this.wall2Mesh.castShadow = true;
        this.wall2Mesh.receiveShadow = true;

        this.wall3Mesh.castShadow = true;
        this.wall3Mesh.receiveShadow = true;
        
        this.wall4Mesh.castShadow = true;
        this.wall4Mesh.receiveShadow = true;

        this.add(this.wall1Mesh);
        this.add(this.wall2Mesh);
        this.add(this.wall3Mesh);
        this.add(this.wall4Mesh);
        this.add(this.roofMesh);
    }


}


