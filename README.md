# ng-3d-vis

Clone this repo using git and check out the mozfest branch. To see it running, use python -m SimpleHTTPServer and go to http://localhost:8000.

## Back face texture

### Instructions
Open components/scene_objects/skybox/glVolumeRenderedSky.js.
Go to line 102.
You should see a statement:
```
    var materialRayMarch = new THREE.ShaderMaterial({
        vertexShader: scope.vm.getShader('../../components/scene_objects/skybox/shaders/vertex_shader_screen_proj.html'),
        fragmentShader: scope.vm.getShader('../../components/scene_objects/skybox/shaders/fragment_shader_ray_march.html'),
        uniforms: uniforms
    });
```

Change the file being used for the fragment shader to:
```
    fragmentShader: scope.vm.getShader('../../components/scene_objects/skybox/shaders/fragment_shader_back_face.html'),
```
Save the file and refresh your browser (make sure Developer Tools are open).

### What's happening
Normally, the shader code is run in two stages. In the first stage, a gradient is drawn to show the position of the back face of the box. This is not rendered on-screen, but passed to the next stage where the volume rendering is done. In the code change above, we have asked for the first stage to be rendered on-screen instead of the second stage.

## Colourful shadows

### Instructions
Open components/scene_objects/skybox/shaders/fragment_shader_ray_march.html.
Go to line 125.
You should see some code like the following:
```
    vec4 lightRayRGBA = vec4(0.94);
    if ((dataRGBAUp.a < 0.01)){
        lightRayRGBA = vec4(1.0);
    }
    else if (sign(ladder - vec4(0.05)) == vec4(1.0)){
        lightRayRGBA = vec4(0.7);
    }
    else if (sign(ladder.xyz - vec3(0.05)) == vec3(1.0)){
        lightRayRGBA = vec4(0.76);
    }
    else if (sign(ladder.xy - vec2(0.05)) == vec2(1.0)){
        lightRayRGBA = vec4(0.82);
    }
    else if ((dataRGBAUp.a > 0.05)){
        lightRayRGBA = vec4(0.88);
    }
    return lightRayRGBA;
```
For each of the lines above that looks like:
```
    lightRayRGBA = vec4(x);
```
change it to:
```
    lightRayRGBA = vec4(x, y, z, 1.0);
```
where x, y and z are any numbers you like between 0 and 1. Make sure they are decimals! For example:
```
    lightRayRGBA = vec4(0.5, 0.76, 0.21, 1.0);
```
Save the file and refresh your browser (make sure Developer Tools are open).


### What's happening
Instead of running a full optical model to simulate light passing through the cloud (which takes a long time), this code "paints on" shadows and highlights by seperating the cloud into just a few bands. In the code change above, we have hacked this shortcut by making the lighting on each band a different colour.

## Randomness

### Instructions
In fragment_shader_ray_march.html, go to line 45.
You should see a function:
```
    vec4 getDataRGBAfromDatum(float datum){
        vec3 color = getDatumColor(datum);
        float alpha = getDatumAlpha(datum);
        return vec4(color.xyz, alpha);
    }
```
Change it to:
```
    vec4 getDataRGBAfromDatum(float datum){
        vec3 notacolor;
        vec3 color = notacolor;
        float alpha = getDatumAlpha(datum);
        return vec4(color.xyz, alpha);
    }
```
Save the file and refresh your browser (make sure Developer Tools are open).


### What's happening
Notice that we used the variable 'notacolor' without defining its value. Because of this, we end up with a colour value based solely on what happened to be in memory when we declared the variable, so it's essentially random.

### Extension
Try this if you want to give yourself nightmares.
```
    vec4 getDataRGBAfromDatum(float datum){
        vec3 notacolor;
        float notanalpha;
        vec3 color = notacolor;
        float alpha = notanalpha;
        return vec4(color.xyz, alpha);
    }
```

## Colour scale

### Instructions
In fragment_shader_ray_march.html, go to line 30.
You should see a function:
```
    vec3 getDatumColor(float datum) {
        vec3 color = vec3(1, 1, 1);
        return color;
    }
```
Change 'color' to something depending on 'datum', for example:
```
    vec3 getDatumColor(float datum) {
        vec3 color = vec3(datum/2.0, datum/2.0, 1.0-datum);
        return color;
    }
```
Save the file and refresh your browser (make sure Developer Tools are open).

### What you should see
Something like:

### What's happening
In the original code, all cloud was white regardless of the value for the cloud fraction. We have changed it so that the cloud fraction determines the cloud's colour.

## Bounds

### Instructions
If you managed to use a colour scheme during the previous exercise, leave it there.
In fragment_shader_ray_march.html, go to line 36.
You should see a function:
```
    float getDatumAlpha(float datum) {
        if (datum > 0.0 && datum < 0.9) {
            return datum * alphaCorrection;
        }
        else {
            return 0.0;
        }
    }
```
Change the bounds in the condition, e.g.
```
    float getDatumAlpha(float datum) {
        if (datum > 0.2 && datum < 0.3) {
            return 1.0;
        }
        else {
            return 0.0;
        }
    }
```

### What's happening
Instead of showing all the data, we have hidden everything that doesn't fall within our chosen bounds. To make it easier to see, we have switched to a binary display of cloud/no cloud instead of varying the opacity with cloud fraction.
