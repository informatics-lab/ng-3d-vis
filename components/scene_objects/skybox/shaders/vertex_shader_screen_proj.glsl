varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;

uniform vec3 dimensions;
uniform vec3 cameraNormal;

vec3 toLocal(vec3 p) {
    vec3 pos = (p + (dimensions / 2.0)) * (1.0 / dimensions);
    return vec3(pos.xy, 1.0 - pos.z);
}

const float near = 0.1; // magic number!

void main()
{
    vec3 pos = position;
    vec3 cameraToPos = pos - cameraPosition;
    float d = dot(cameraToPos, cameraNormal);

    if (d < near){
        pos = pos - (d - near) * cameraNormal;
    }

    worldSpaceCoords = (modelMatrix * vec4(toLocal(pos), 1.0 )).xyz;
    gl_Position = projectionMatrix *  modelViewMatrix * vec4( pos, 1.0 );
    projectedCoords =  projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}