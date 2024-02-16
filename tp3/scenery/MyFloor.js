import * as THREE from 'three';

/**
 * MyFloor
 * This class generates with a plane geometry and a with a vertex and fragment shader
 */
class MyFloor extends THREE.Mesh {
  constructor(size, segments) {
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

    // Vertex shader to generate the height
    const vertexShader = `
    uniform sampler2D heightmap;
    varying vec2 vUv;
  
    void main() {
      vUv = uv;
      float height = texture2D(heightmap, vUv).r;
      vec3 newPosition = position + normal * height * 100.0; // Adjust the multiplier as needed
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
    `;

    // Fragment shader to color the plane
    const fragmentShader = `
    uniform sampler2D colormap;
    varying vec2 vUv;
  
    void main() {
      vec3 color = texture2D(colormap, vUv).rgb;
      float height = dot(color, vec3(0.299, 0.587, 0.114)); // Convert RGB to grayscale
  
      // You can adjust the multiplier for the height effect
      vec3 adjustedColor = color + height * 0.1;
  
      gl_FragColor = vec4(adjustedColor, 1.0);
    }
    `;

    const heightmapTexture = new THREE.TextureLoader().load('assets/heightmap.png');

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        heightmap: { value: heightmapTexture },
      },
    });

    // Call the parent constructor with the geometry and material
    super(geometry, material);

    this.rotateX(-Math.PI / 2);
    this.position.y = -0.5;
  }
}

export { MyFloor };

