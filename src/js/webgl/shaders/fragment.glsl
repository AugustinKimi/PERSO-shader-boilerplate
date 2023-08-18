varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uProgress;
uniform float uMouseStrength;
uniform vec2 uMouse;

void main ()
{
    gl_FragColor = vec4 (vUv, 0.0, 1.0);
}