import * as THREE from 'three';

/**
 * This class loads the textures.
 */
class MySpriteSheetLoader {

    constructor(texture_path, initial_x, inital_y, initial_z, spacing) {
        this.texture_path = texture_path;
        this.sprites = [];
        this.numberOfColumns = 96;
        this.numberOfRows = 1;
        this.initial_x = initial_x;
        this.initial_y = inital_y;
        this.initial_z = initial_z;
        this.spacing = spacing;
    }

    /**
     * Creates a sprite from a character code
     * @param {*} charCode 
     * @returns 
     */
    createSprite(charCode) {

        // Creates a texture from the sprite sheet
        const texture = new THREE.TextureLoader().load(this.texture_path);
    
        const columnIndex = charCode % this.numberOfColumns;
        const rowIndex = Math.floor(charCode / this.numberOfColumns);
    
        // Creates the material and geometry for the sprite
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const geometry = new THREE.PlaneGeometry(16, 16);
        
        // Creates the sprite mesh
        const sprite = new THREE.Mesh(geometry, material);
        sprite.material.map.repeat.set(1 / this.numberOfColumns, 1 / this.numberOfRows);
        sprite.material.map.offset.set(columnIndex / this.numberOfColumns + 0.001, 1 - (rowIndex + 1) / this.numberOfRows);
        sprite.position.set(0, 0, 0);
    
        return sprite;
    }

    /**
     * Loads a text
     * @param {*} text 
     * @returns 
     */
    loadText(text) {
        for (let i = 0; i < text.length; i++) {
            let charCode;

            if (text[i] >= '0' && text[i] <= '9') {
                charCode = text.charCodeAt(i) - '0'.charCodeAt(0) + 15; // Offset by the first 15 characters of the ASCII table

                console.log("Text:", text[i], "charCodeAt:", text.charCodeAt(i), "0 charCodeAt:", '0'.charCodeAt(0),"charCode:", charCode)
            }
            else if (text[i] === '.'){
                charCode = 13; // For the dot
            }
            else if (text[i] >= '.' && text[i] < '~') { // Other characters
                console.log("Character:", text[i], "charCodeAt:", text.charCodeAt(i), "Space charCodeAt:", ' '.charCodeAt(0));
                charCode = text.charCodeAt(i) - ' '.charCodeAt(0);
            }
        
            const sprite = this.createSprite(charCode);
            this.sprites.push(sprite);
        }

        const startPosition = new THREE.Vector3(this.initial_x, this.initial_y, this.initial_z);

        // Position the sprites
        this.sprites.forEach((sprite, index) => {
            sprite.position.set(startPosition.x + index * this.spacing, startPosition.y, startPosition.z);
        });

        return this.sprites;
    }
}

export { MySpriteSheetLoader };