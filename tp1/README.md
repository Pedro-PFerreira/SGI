# SGI 2023/2024 - TP1

## Group T03G01
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Pedro Pereira Ferreira         | 202004986 | up202004986@edu.fe.up.pt                |
| Lourenço Alexandre Correia Gonçalves         | 202004816 | up202004816@edu.fe.up.pt                |

----
## Project information

- The goal of this project is to understand the basic concepts of Three.js, as well as the fundamental concepts of the Graphical Computation.

- In the first part of TP1 focuses on cameras, basic geometries and transformations.


- Scene
  - In this scene we can see a cyan plane and a yellow box right above the plane, as well as a 3D axis:

  ![Scene capture](./images/scene.png)


 ### 4.1.2- Cameras

  - Our first task was to change some parameters of the perpective camera, in this part of the code:
  
  ```js
      // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera(120, aspect, 0.1, 1000 );
        
        perspective1.position.set(3,3,3)
  ``` 
 - This increased the FOV, and the camera got closer to the cube. Now the scene is like this:

 ![New Scene Capture](./images/new_scene.png)

 - After that, we tried out the orthographic cameras in the GUI. In the screenshot below, we can see the GUI's commands that allow us to change the perspective:

 ![Camera GUI](./images/camara_gui.png)


 - Then we created a new perspective camera, as well as the right and back orthographic cameras. Here are the results:

- Perspective 2:
 ![Perspective 2](./images/perspective_2.png)


- Right Orthographic Camera:

![Right](./images/right.png)

- Back Orthographic Camera:

![Back](./images/back.png)

 
### 4.1.3- Geometric Transformations

- In this task we had to implement some transformations to the cube. We also knew that these transformations would be applied to the cube's matrix attribute and they used the cube's mesh to do so.

- Firstly, we had to identify where were the operations of the transformations of the cube. They were in the funtion buildBox():

```javascript

this.boxMesh.rotation.x = -Math.PI / 2;
this.boxMesh.position.y = this.boxDisplacement.y;

```

- We made some experiments to understand the transformations. Here's the result of making a translation of 4 units in the x axis:

```javascript

this.boxDisplacement.x = 4;

```

![Transformation1](./images/transformation1.png)

- Then we made a rotation of 20 degrees in the x axis and another of -20 degrees in the same axis:

![Rotation20](./images/rotation20.png)

![Rotation-20](./images/rotation-20.png)

- We could conclude that in the first one is rotating counterclockwise (positive) while the second one is rotation in the opposite direction (negative).

- After that, we made a rotation in x axis of 20 degrees, followed by a translation in z axis for 4 units. Here is the result:

```javascript

  this.boxDisplacement.z = 4;
  this.boxMesh.rotation.x = THREE.MathUtils.degToRad(-20)
  this.boxMesh.position.z = this.boxDisplacement.z;
```

![Rotation and Translation](./images/rot_and__translation.png)

- Then, we switched the order of the 2 operations to see the differences. We also commented the code in the "update()" method related to the box displacement, since it would interfere with the order of the operations.

```javascript

  this.boxDisplacement.z = 4;
  this.boxMesh.position.z = this.boxDisplacement.z;
  this.boxMesh.rotation.x = THREE.MathUtils.degToRad(-20)
  
```

- The result was the same in the 2 sequences.

- We also tried with a scalation of (1,1,2) followed by a translation in y axis of 2 units:
```javascript

  this.boxMesh.scale.set(1,1,2);
  this.boxMesh.position.set(0,2,0);
  //this.boxMesh.rotation.x = THREE.MathUtils.degToRad(-20);

```
- Here is the result:

![Scalation and Translation](./images/scale_and_translation.png)

- We've also change the order of the operations and the result as also the same as before. This is due to the fact that Three.js has a predefined order to make the transformations.


### 4.1.4- Geometries

- The goal of this task is to explore some of the geometries that Three.js has to offer. We had to create a new scene with a plane, a box. We also add a circle, a sphere,a partial cylinder, a cone and a polyhedron. Here's the result:

![4.1.4](./images/4.1.4.png)


### 4.1.5- 3D scene Modeling

- The goal of this task is to create a room with a table that contains a cake upon it. The cake also has a small candle on top of it. Here's the result:

![Cake](./images/cake.png)

## 4.2- Illumination

### 0.0.1- Materials and Light Sources

- Our goal in this project phase is to understand the concepts of light, as well as materials.

- Here is the code related with the light sources:

```javascript
  // add a point light on top of the model
  const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
  pointLight.position.set( 0, 20, 0 );
  this.app.scene.add( pointLight );

  // add a point light helper for the previous point light
  const sphereSize = 0.5;
  const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  this.app.scene.add( pointLightHelper );

  // add an ambient light
  const ambientLight = new THREE.AmbientLight( 0x555555 );
  this.app.scene.add( ambientLight );

```

- This snippet of code is related to the cube and plane materials, respectively:

```javascript
  //Cube material
  let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
          specular: "#000000", emissive: "#000000", shininess: 90 })

  // Plane material
  this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
              specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })
```

- As we identified in the code, on the top of the scene we could find a light source of type PointLight, which emits light in all directions. There was also helper to identify the PointLight. Without it the light source would be invisible.

- We changed the type of light in the planeMaterial to diffuse, changing how it reflects light.

![Diffuse light](./images/diffuse.png)

- In contrast, using specular reflection, there is a noticable white highlight that was not present before.

![Specular light](./images/specular.png)


- Then, we had to alter the position of the light source from (0,20,0) to (0, -20, 0). 

- Now that the light source is below the cube and plane, we noticed that we could see the bottom face of the cube fully illuminated, while the plane is not visible at all

![Bottom cube](./images/bottom_cube.png)

- When looking from above, we could see that the top and side faces of the cube, as well as the plane, are only illuminated by ambient light, as they are facing away from the light source.

![Cube's top and sides](./images/top_cube.png)

- After that, we changed the position and the intensity of the PointLight so that it is located inside of the cube. We noticed that the light goes through the cube, illuminating the plane below. The cube itself is not affected by this light source, since its faces are facing away from it.

![Inside the cube](./images/light_in_cube.png)

- Modifying the plane's diffuse color to black ("rgb(0,0,0)"), only the specular component reflected on the plane.

![Black Light](./images/black_light.png)

- Increasing the shininess of the plane to 400, the reflection highlight became smaller and more intense. This makes sense, as it increases the specular component (ks) in the specular reflection formula.

- After that, we made some changes in the plane's material and the point light and obtained this result:

![New Changes](./images/new_changes.png)

- When increasing the light's maximum distance, we saw everything darker, since the light was too far away (20) to illuminate the scene with the maximum distance set to 15.

![Darker Light](./images/light_low_distance.png)


- Finally, we reset the maximum distance value to 0 and made some experiments with the decay factor. We noticed that the greater the value, the darker the plane and cube were, as expected.

- Here's the result with decay at 0:

![Decay 0](./images/decay_0.png)


- With decay at 1:

![Decay 1](./images/decay_1.png)

- And decay at 2:

![Decay 2](./images/decay_2.png)


### 0.0.2- Light sources

- We went back to the 1st commit and reset the scene, but changed the ambient light and removed the point light.

- Then we added a new directional light to the scene and experimented different values for the intensity parameter. We concluded that the greater the intensity's value, the brighter are the objects and viceversa.

- When changing the position of the directional light, we observed that it always points to the origin of the scene (0,0,0)

- The target value is the position's point that the light is aiming to. Its default value is (0,0,0), so if we changed it to another point, the light points to there.

![Directional Light](./images/dir_light.png)

- Then, we started to explore the SpotLight and added one instance of it to the scene, with the specified parameters. We noticed that the light is emitted in a cone shape, and the intensity of the light decreases as it gets further away from the center of the cone.

- We noticed that the helper is fundamental for the scene, due to the fact it shows relevant information to the user, such as where the point light is and shows that only the cone delimited by it is illuminated by the spot light. We can perceive as well where the penumbra starts and ends. 

- The top and the other 2 faces that are illuminated by the spot light have different illuminations: the closer they are to the light source, the brighter it is illuminated.

![Spot Light](./images/spotlight.png)

- In addition of that, we created a small GUI folder so that a user can modify the spot light's attributes. With that, we changed its angle to 35º.

- The 3 illuminated faces have the same effect as before. However, the top face is partially illuminated.

![Spot Light GUI](./images/spotlight_gui.png)

- Then we analysed the penumbra's effect on the illumination. We tried this values: 0.2, 0.7 and 1.0. We conclude that the greater its value is, the more noticeable the penumbra is, whether in the top face and the plane as well.

- In addition of that, we explored the plane light, also known as RectAreaLight in Three.js. We added one instance of it to the scene, with the specified parameters. We noticed that the light is emitted in a rectangular shape, and the intensity of the light decreases as it gets further away from the center of the rectangle.

- A RectAreaLight just needs a color, its intensity and its width and height. We can also set its position and the point in the scene is looking at.

- The main differences between this light source and the others is that are:

- It is not a point light- it has a rectangular shape.
- Is not from the same libraries than the others, we had to import them.
- Only 2 materials (MeshStandardMaterial and MeshPhysicalMaterial) are the only ones that can reflect its light.

- Here's the result of our experiment- the ball is reflecting the magenta light emitted by the plane light:

![RectArea Light](./images/rect_area_light.png)

## 4.3- Textures

### 4.3.8- Materials & Textures Relationship

- In the first step, we needed to analyze the colors of the plane image. It seems to have the normal colors of the pictures. However, when we changed the plane's diffuse colour to red, it became red too. As a result, we concluded that the color of the image would be a mix with the material and the texture colors of the plane.

![Red texture](./images/red_texture.png)

- When we switched to the 2nd alternative, we noticed that now the plane reflected more light. Furthermore, we concluded that while the first alternative had specular highlights, the second one didn't due to the fact that the latter is a MeshLambertMaterial.

![Lambert Mat](./images/texture_lambert.png)

### 4.3.9- Wrapping of Textures - Scaling

- In terms of polygon and texture dimensions, we noticed that the image fully fit in the plane, and the original length/width ratio of the texture in the image appeared to be maintained.

- So, we changed the plane size from 10x7 to 10x3 and while the entire image was still shown, the ratio was not maintained, appearing more stretched.

![Texture Stretched](./images/texture_stretched.png)


- In the code below we could see why the image fully fit in the plane: since ```planeTextureRepeatU``` is 1, the 
```planeTextureRepeatV``` would be equal to plane's rate times the the texture's rate, which would ensure that the texture has the same dimensions as the plane and, as a result, the image would fit in the plane.

```javascript
let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
```

- Changing the plane's U size to 10 and the V size to 3, and the plane to the same dimensions, we could see that not the entire image was shown, but the ratio was maintained.

![Texture cut](./images/texture_cut.png)

- After that, we reset the size of V direction and changed the the Repeat scale at U at 2.5. We analysed that the images was repeated 2.5 times in both directions.

- We also confirmed that the image's ratio was maintained, due to the snippet of code above, that calculates the V repeat scale based on the U repeat scale.

![Texture Repeat](./images/texture_repeat.png)

- Besides that, also changed to type of wrapping to ClampToEdgeWrapping in both axis. We concluded that the image fit in its dimensions and the last edges of each axis are repeated throughout the plane.

![Clamp to Edge](./images/texture_clamped.png)

- Finally, we changed to mirroredRepeat and we observed that the images are repeated in both axis, but one image is a reflection of the other.

![Mirrored Repeat](./images/texture_mirrored.png)

### 4.3.10- Offset of Textures - Translation

- In this task, we had to change the offset of the texture in the U direction to 0.2 and the V direction to 0.1. We concluded that the image was translated in both axis, and the image was still repeated in the plane.

![Texture Offset](./images/texture_offset.png)


### 4.3.11- Offset of Textures - Rotation

- In this task, we had to change the rotation of the texture to 30 degrees. We concluded that the image was rotated 30 degrees in the plane and the empty space was filled die to the texture repeat

- According to the documentation, we could set the rotation pivot as any point we wanted by assigning the desired point to the texture's center property.

![Rotation Texture](./images/rotation_texture.png)

### 4.3.12- Cube with Texture

- After that, we changed the code to change the cube's texture to FEUP's entry. Here is the result:

![FEUP Cube](./images/FEUP_cube.png)

### 4.3.13- Texture Interface

- In this task, we had to create a GUI to change the texture's attributes. Here is the result:

### 4.3.14- 3D Scene Improvements

- Finally, we just had to improve our scene with our knowledge of materials and textures and attend to the specifications of the task. Here is the result:

![Louvre's Birthday](./images/louvre's_birthday.png)

## 4.4- Curve Lines

### 4.4.11- Polyline

- In this section we had to explore the various types of lines in Three.js. We started with simplest one: the Polyline.

- We switched our code to the provided and we observed that there were 3 straight red lines with 4 vertices, centered around the origin.

![Polyline](./images/polyline.png)


- After enabling the drawing of the convex hull, we can see that another line seems to be drawn, overlapping with the first one.

![Polyline Hull](./images/polyline_hull.png)

- Then, we changed the opacity of the hull, in order to make it more visible, as well as the polyline's form: we changed the vertice's position and its center and made it have 5 edges:

![5 edges](./images/5_edge_polyline.png)


### 4.4.12- QuadraticBezierCurve


- The next curve type to explore is the Quadratic Bêzier curve.

- We added the code provided and we observed that there was 2 white line segments with 3 vertices, centered around the origin. This line corresponds to the curve's Hull.

![Quadratic Bezier Hull](./images/quadratic_bezier_hull.png)

- The commented code samples points from the line, and creates a new BufferGeometry from them. Combining it with a material, a Line is created and added to the scene. We also confirmed the number of the small segments is the same as the specified in the samples. The curve looks like this:

![Quadratic Bezier Curve](./images/quadratic_bezier_curve.png)

- By changing the number of samples to 16, the curve line is a lot smoother.

- We also changed the curve's points and center. Here's the result:

![Final Quadratic Bezier Curve](./images/final_quadratic_bezier_curve.png)


### 4.3.13- CubicBezierCurve

- The next curve type to explore is the Cubic Bêzier curve.

- We copied the previous code and adapted in order to create an instance of this curve. This time, the curve needed 4 points. This is what it looks like:

![Cubic Bezier Curve](./images/cubic_bezier_curve.png)

### 4.3.14- CatmullRomCurve

- After that, we had to explore the Catmull-Rom curve. We copied the previous code and adapted in order to create an instance of this curve.

- Firstly, we created a simple one that goes through 7 points. We confirmed that whether the hull and curve itself were drawn. Using only 4 samples, the curve was not smooth enough and did not pass through all of the points.:

![First Catmull Rom Curve](./images/catmullrom_curve.png)

- By increasing the number of samples, we observed the curve was getting closer to touching the points, getting more similar to the hull. We also concluded that the more points used, the more samples we need to obtain a smooth curve.

- We changed some points and increased the number of samples and we obtained this curve:

![Final Catmull Rom Curve](./images/final_catmullrom_curve.png)


## 4.5- Curved Surfaces


- The next step is to explore the curved surfaces. We started with the NURBS curve by using the code provided, which we had to analyze.

- Firstly, we observed the imports: the NURBS curve is not part of the Three.js library, so we had to import it from the NURBS addon, as well as the parametric curves.

- We also noticed that needs some specific parameters: the degrees for both directions U and V, the samples and the number of knots. The degrees are the degrees of the curve, the samples are the number of points that the curve will have and the knots are the points that the curve will pass through.

- We observed that the object returned is the parametricGeometry and not the nurbSurface- this one will be used in the constructor of the first one. The geometry will also need to be converted as a mesh, which will be done.

- We also changed the MyContents.js' code to the provided. We saw a flat rectangle with a texture which illustrates how U and V evolves through the surface. We obtained the following result:

[First Curved Surface](./images/first_curved_surface.png)

- The method ```this.builder.build()``` found in MyContents.js file shows how the surface is built and how the parameters are passed, since this only creates the geometry that needs to be converted to a mesh, which happens in the next instruction.

- We changed the number of samples several times and we concluded that it does not make any difference in the surface due to it being or a flat surface.

- We changed the weight of the first point to 5 and we observed that the texture was distorted, as if the texture was dragged towards the point.

![Curved Surface Weight 5](./images/curved_surface_weight_5.png)

- Changing the weight to 3, the same effect is observed, but it with less intensity. Changing the weight to 0.2, the texture seems to be dragged away from the point, since the weight is less than 1.

- If we changed the weight in the last points, the texture would be dragged towards them.

- Using the points of the second surface and we noticed that both direction U and V have degree 2 and 1, respectively , since the top and bottom curves are curves, while the left and right ones are lines. This also coincides with the degree specified by us in the code (orderU = 1, orderV = 1).

-  Similarly to what happened in curves, the increasing the number of samples makes the surface smoother. The difference between the flat surface is that this one is curved, so the samples are more noticeable.

- By increasing the weight in the last point, the affected vertex was the (1,1), as expected.

- Here's the result of our experiments:

![Second Curved Surface](./images/second_curved_surface.png)

- The third surface provided had 3 points in U direction and 4 in V direction. We concluded that the degrees were 2 and 3, respectively, since the top and bottom curves are a quadratic curves, while the left and right ones are cubic. This also coincides with the degree specified by us in the code (orderU = 2, orderV = 3).

- The increasing the number of samples makes the surface smoother, as expected and similarly to what happened with the previous surfaces.

- By increasing the weight in the last point, the affected vertex was the (1,1), as expected.

- Here's the result of our experiments:

![Third Curved Surface](./images/third_curved_surface.png)

- The forth surface provided had 4 points in U direction and 3 in V direction. The U degree goes up to 3 and the V degree up to 2, since the top and bottom curves are cubic curves, while the left and right ones are quadratic. This also coincides with the degree specified by us in the code (orderU = 3, orderV = 2).

- Increasing the number of samples and the weight in the last point, the behaviour observed was the same as the previous surfaces.

- Here's the result of our experiments:

![Fourth Curved Surface](./images/fourth_curved_surface.png)

- Changing points in the surfaces, we observed that the surface was changed to adapt to the new points, as expected. 

![Surface Point Changed](./images/surface_point_changed.png)


- We improved the scene by adding objects made by curves or surfaces (The bettle, the flower, the jar and the newspaper). Here's the result:

<TODO> Insert photo.

## 4.6- Shadows Projection

- In this phase we had to explore how to do shadow projections. We changed the code to the provided one, and we saw several small planes and a cube projecting shadows in the plane.

![Shadow Projection 10 Objects](./images/shadow_projection_10.png)


### 4.6.21- Shadow Map resolution

- After that, we changed the map resolution from 4096 to 1024. As expected, the shadows became very pixelated.


![Map Size 1024](./images/mapSize_1024.png)

- Additionally, we also explored the following types of shadows:

  - THREE.BasicShadowMap 
  - THREE.PCFShadowMap 
  - THREE.PCFSoftShadowMap
  - THREE.VSMShadowMap

- The BasicShadowMap seems to be slightly better than the PCFSoftShadow, while having a lower resolution. The PCFShadowMap only reflects shadows that come from PointLights;

- With VSMShadowMap, even the shadow receivers are casting shadows:

![VSM ShadowMap](./images/VSMShadowMap.png)

### 4.6.22- Shadows related to the ground

- Turning off the point light source, leaving only the directional light source and increased the number of rectangles drawn to 100.

- We observed that the shadows became darker and some of them were projected on other rectangles of the scene and on the floor. The floor did not project a shadow on the rectangles below, but the shadows projected above the floor did hit the rectangles below it.

![Shadows from planes to planes](./images/shadow_from_plane_to_plane.png)

- We reversed the x orientation of the plane's rotation and we observed that the light didn't go through the floor, projecting a shadow on the rectangles below it. Also, de floor became invisible when seen from above and totally black from below.

- As a result, we concluded when an object is turned against a source light (in this case, a directional one), it projects a shadow.

- Changing the floor from a plane to a very thin box, the problem was solved, since the light was blocked from crossing the floor and it was still visible from above, having shadows projected on it's surface.

![Floor as a box](./images/floor_box.png)

### 4.6.23- Shadows related to the directional light source

- We changed the dimensions of the directional light and we observed that the shadows were cut off, only present inside a rectangular area on the floor. This is also valid for the rectangles below the floor.

![Directional light redimensioned](./images/directional_light_redimensioned.png)

- We also reduced the "far" value of the directional light and we concluded that some shadows were cut off below a certain point.

![Directional light far reduced](./images/less_far.png)

### 4.6.24- Shadows related to the point light source

- We turned on the point light source again and we obeserved that some shadows projected by the respective rectangles appeared in other ones, as well as in the floor. It was not visible any shadow from the floor in the reactangles below it.

- When the direction of the plane was reversed, the floor was not visible and no shadows were projected on the rectangles below it. In this case, we concluded that the light was not crossing the floor.

- Making the floor as a thin box, the problem was solved, as expected.

![Fix with point light](./images/fix_point_light.png)

- Changing the "far" value of the point light source, we observed that the shadows projected by the directional light were softened if they were inside the point light's distance.

![Point Light with less far](./images/less_far_point_light.png)

### 4.6.25- Influence of shadows on the frame rate

- We turned off the point light source and also reset the changes made to the directional light source. We also changed the number of rectangles to 250. With these values, the app was running at 60 fps on average. With 3250 polygons, the FPS was 40 on average. To get to an average of 20 FPS, we needed to increase it to 6750 polygons.

- We turned on the point light source again and reset the number of polygons to 250. With these values, the app was running at an average of 60 FPS. With 2150 polygons, the FPS was 40 on average. We just needed to increase to 4250 polygons to get an average of 20 FPS.

### 4.6.26- 3D Scene improvements

- Finally, we needed to make some improvements to our scene. We added the shadows for the cake projected on the table. In addition of that, we also made the room larger and added another spotlight aiming to the table's legs, in order to highlight the specular aspect of them. Here's the result:

![Final Scene](./images/final_scene.png)

- Here is the link for the scene: 
[!Scene]http://127.0.0.1:5500/tp1/
----
## Issues/Problems

- (items describing unimplemented features, bugs, problems, etc.)

