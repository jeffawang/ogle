import * as ogl from 'ogl-typescript';

function main(root: HTMLElement) {
    const renderer = new ogl.Renderer();
    const gl = renderer.gl;

    let canvases = root.getElementsByTagName("canvas");
    if (canvases.length == 0) {
        root.appendChild(gl.canvas);
    } else {
        gl.canvas = canvases[0];
    }

    const geometry = new ogl.Geometry(gl, {
        position: {size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3])},
        uv: {size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2])},
    });

    const program = new ogl.Program(gl, {
        vertex: `
            attribute vec2 uv;
            attribute vec2 position;

            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `,
        fragment: `
            precision highp float;
            uniform float uTime;
            varying vec2 vUv;
            void main() {
                gl_FragColor.rgb = vec3(0.8, 0.7, 1.0) + 0.3 * cos(vUv.xyx + uTime);
                gl_FragColor.a = 1.0;
            }
        `,
        uniforms: {
            uTime: {value: 0},
        },
    });

    const mesh = new ogl.Mesh(gl, {geometry, program});

    requestAnimationFrame(update);
    function update(t) {
        requestAnimationFrame(update);
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({scene: mesh});
    }
}

// const el = document.getElementById("main");
const el = document.body;
main(el);