import * as THREE from 'three';


export class MyBeetle extends THREE.Group{

    constructor() {
        super();

        //Rodas
        this.drawCircumference(0.3, new THREE.Vector3(0.5,0,0), 0, Math.PI, 25);
        this.drawCircumference(0.3, new THREE.Vector3(-0.5,0,0), 0, Math.PI, 25);

        //Capot
        this.drawCircumference(0.8, new THREE.Vector3(0,0,0), Math.PI/2, Math.PI, 25);
        this.drawCircumference(0.4, new THREE.Vector3(0,0.4,0), 0, Math.PI/2, 25);
        this.drawCircumference(0.4, new THREE.Vector3(0.4,0,0), 0, Math.PI/2, 25);

        //Quadro
        this.buildPainter();

     }

    drawCircumference(radius, center, thetaStart, thetaEnd, segments){
        const curve = new THREE.Curve();
        curve.getPoint = function (t) {
            const theta = THREE.MathUtils.lerp(thetaStart, thetaEnd, t);
            const x = center.x + radius * Math.cos(theta);
            const y = center.y + radius * Math.sin(theta);
            const z = center.z;
            return new THREE.Vector3(x, y, z);
        };

        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
        const lineObj = new THREE.Line(curveGeometry, lineMaterial);
        lineObj.center = center;

        lineObj.rotation.y = Math.PI/2;

        lineObj.position.set(-7.35,4.5,0);
        this.add(lineObj);
    }

    buildPainter(){

        // Pintura

        this.paintGeometry = new THREE.PlaneGeometry(3.4, 2.6);

        this.paintMaterial = new THREE.MeshStandardMaterial({ color: "#faf0e6",
        emissive: "#aaaaaa"});
        this.paintMesh = new THREE.Mesh(this.paintGeometry, this.paintMaterial);

        this.paintMesh.receiveShadow = true;

        this.paintMesh.rotation.y = Math.PI/2;

        this.paintMesh.position.set(-7.35,5,0);

        // Borda

        const paintingBorder = new THREE.PlaneGeometry(4, 3, 5, 5);

        const paintingBorderTexture = new THREE.TextureLoader().load('textures/border_texture.png');
        paintingBorderTexture.wrapS = THREE.ClampingtoEdge;
        paintingBorderTexture.wrapT = THREE.ClampingtoEdge;


        const paintingBorderMaterial = new THREE.MeshStandardMaterial({
            color: "#FFD700",
            metalness: 0.9,
            roughness: 0.5,
            map: paintingBorderTexture
        });

        paintingBorderMaterial.side = THREE.DoubleSide;

        const paintingBorderMesh = new THREE.Mesh(paintingBorder, paintingBorderMaterial);
        paintingBorderMesh.receiveShadow = true;
        paintingBorderMesh.position.set(-7.4,5,0);
        paintingBorderMesh.rotation.y = Math.PI/2;

        this.add(paintingBorderMesh);
        this.add(this.paintMesh);

    }


}