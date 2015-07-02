varying vec3 worldSpaceCoords;

uniform vec3 dimensions;

vec3 toLocal(vec3 p) {
    vec3 pos = (p + (dimensions / 2.0)) * (1.0 / dimensions);
    return vec3(pos.xy, 1.0 - pos.z);
}

void main(){
    //Set the world space coordinates of the back faces vertices as output.
    worldSpaceCoords = toLocal(position); //move it from [-0.5;0.5] to [0,1]
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1.0 );
}