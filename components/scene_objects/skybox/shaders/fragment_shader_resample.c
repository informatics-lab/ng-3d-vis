uniform sampler2D rayMarchTexture;

varying vec4 projectedCoords;

void main(){
    //The fragment's world space coordinates as fragment output.
    vec2 texCoord = vec2(((projectedCoords.x / projectedCoords.w) + 1.0 ) / 2.0,
                    ((projectedCoords.y / projectedCoords.w) + 1.0 ) / 2.0 );
    gl_FragColor = texture2D(rayMarchTexture, texCoord);
}