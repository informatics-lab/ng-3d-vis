varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;

uniform vec3 dimensions;

vec3 toLocal(vec3 p) {
    vec3 pos = (p + (dimensions / 2.0)) * (1.0 / dimensions);
    return vec3(pos.xy, 1.0 - pos.z);
}

void main()
{
	worldSpaceCoords = (modelMatrix * vec4(toLocal(position), 1.0 )).xyz;
	gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );
	projectedCoords =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}