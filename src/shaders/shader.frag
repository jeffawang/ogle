precision highp float;
uniform float u_time;
varying vec2 v_uv;
void main() {
    gl_FragColor.rgb = vec3(0.8, 0.7, 1.0) + 0.3 * cos(v_uv.xyx + u_time);
    gl_FragColor.a = 1.0;
}