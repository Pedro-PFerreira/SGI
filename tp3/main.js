import * as THREE from 'three';
import { MyApp } from './MyApp.js';

import { MyMenuContents } from './scene_contents/MyMenuContents.js';
import { MyRaceContents } from './scene_contents/MyRaceContents.js';
import { MySelectingContents } from './scene_contents/MySelectingContents.js';
import { MySelectingOpptContents } from './scene_contents/MySelectingOpptContents.js';
import { MyFinalContents } from './scene_contents/MyFinalContents.js';

// create the application object
let app = new MyApp()
// initializes the application
app.init()

// Add the game's scenes
for(let i = 0; i < 5; i++)
    app.addScene(new THREE.Scene())

let scene_contents = [
    new MyMenuContents(app, 0),
    new MySelectingContents(app, 1),
    new MySelectingOpptContents(app, 2),
    new MyRaceContents(app, 3),
    new MyFinalContents(app, 4)
]
// set the contents of the scenes
app.setContents(scene_contents)

// initialize the contents of the scenes
scene_contents.map(async contents => await contents.init())

// set the active scene
app.changeScene(app.activeScene)

// main animation loop - calls every 50-60 ms.
app.render()
