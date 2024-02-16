# TP2 - Development of a 3D graphics application

The aim of this work is to create an application equipped with a small 3D graphics engine, provided by the teachers.

Our scene consists in  consists in an igloo, a snowman and a lamp in the middle of an arctic tundra. In a second plane, we have a mountain range and a sky with the aurora.

- The first strong point is the skybox with the aurora borealis. We used a cube (6 planes) with a video texture of the aurora borealis.

- The other strong point is the snowman. We used 3 spheres: 1 for the head and the others for the body. We also used a orange cylinder for the nose with an carrot texture, 2 black spheres for the eyes and 6 black spheres for the body's dots. We also used 2 black cylinders for the hat. Besides that, we used a cone 2 cylinders for the arms and a plane with a "Welcome" signal texture.

- The igloo is composed by 2 parts: the dome and the tunnel. The base is a half of sphere with a snow brick texture and the tunnel 2 half of cylinders, one with the same snow brick texture and the other with a black material, to simulate the entrance.

- The lamp is composed by many materials: a cylinder with 4 clices for the base, another 4 cylinders with more slices for the supports, a boxes for the base and top, a strecthed sphere with a ambar material for the lamp with a pointlight in it. The cylinders and box have a metal texture.

- The ice floor is composed with an ice texture and several mipmaps levels, to reduce the quality of the texture in the distance.

- The mountain range is composed by mountains, all of them with an ice texture.

- The lakes were made with polygons (buffer geometries), placed in front of the igloo.

- The forest was composed by a group of trees. Each tree is composed by a trunk and a crown, which were wireframe objects. 

- The scene can be visualized in detail.

![Final Scene](./screenshots/final_scene.png)

Scene: http://127.0.0.1:5500/tp2/.