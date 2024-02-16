import * as THREE from 'three';

/**
 * This class loads the textures.
 **/
export class MyTexturesLoader {
    constructor(data) {
        this.data = data;
        this.textures = {};
    }

    /**
     * Loads textures from the scene graph
     * @returns textures
     */
    loadTextures() {
        const data = this.data;

        console.log("[Loading Textures]");

        for (var tex in data) {
            console.log("Loading texture: ", tex);
            let textureData = data[tex];

            this.textures[tex] = this.loadTexture(textureData);
        }

        return this.textures;
    }

    /**
     * Loads a single texture from the scene graph
     * @param {*} textureData 
     * @returns 
     */
    loadTexture(textureData){
        console.log("Loading texture from: ", textureData.filepath);

        let texture_obj = null;

        if (textureData.is_video) {
            let video = document.createElement('video');
            video.src = textureData.filepath;
            video.crossOrigin = 'anonymous';
            video.loop = true;
            video.muted = true;
            video.play();

            texture_obj = new THREE.VideoTexture(video);
            texture_obj.minFilter = THREE.LinearFilter;
            texture_obj.magFilter = THREE.LinearFilter;
            texture_obj.generateMipmaps = false;
            texture_obj.needsUpdate = true;

            texture_obj.wrapS = texture_obj.wrapT = THREE.RepeatWrapping;
        } else {
            texture_obj = new THREE.TextureLoader().load(textureData.filepath); 

            if (textureData.mipmaps && textureData.mipmap0 != null){

                texture_obj.generateMipmaps = false;
                this.loadMipmap(texture_obj, 0, textureData.mipmap0); 
                this.loadMipmap(texture_obj, 1, textureData.mipmap1);
                this.loadMipmap(texture_obj, 2, textureData.mipmap2);
                this.loadMipmap(texture_obj, 3, textureData.mipmap3);
                this.loadMipmap(texture_obj, 4, textureData.mipmap4);
                this.loadMipmap(texture_obj, 5, textureData.mipmap5);
                this.loadMipmap(texture_obj, 6, textureData.mipmap6);
                this.loadMipmap(texture_obj, 7, textureData.mipmap7);
            }
            texture_obj.needsUpdate = true;

        }

        return texture_obj;
    }

    /**
     * Loads the Mipmaps levels of a texture, if they are set.
     * @param {*} parentTexture 
     * @param {*} level 
     * @param {*} path 
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0)
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }
}