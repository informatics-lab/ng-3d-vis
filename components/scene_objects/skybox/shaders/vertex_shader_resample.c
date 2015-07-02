varying vec4 projectedCoords;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    projectedCoords =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}