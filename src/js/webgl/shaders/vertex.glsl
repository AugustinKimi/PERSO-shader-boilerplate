varying vec2 vUv;

void main ()
{
    vec3 worldPosition = (modelMatrix * vec4 (position, 1.0)).xyz;
    vec3 newPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4 (position, 1.0);
    vUv = uv;
}