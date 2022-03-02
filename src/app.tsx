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


    const camera = new ogl.Camera(gl);
    camera.position.z = 5;

    function resize() {
        renderer.setSize(root.clientWidth, root.clientHeight);
        camera.perspective({
            aspect: gl.canvas.width / gl.canvas.height,
        });
    }
    window.addEventListener('resize', resize, false);

    const scene = new ogl.Transform();

    const geometry = new ogl.Box(gl);

    const program = new ogl.Program(gl, {
        vertex: `
            attribute vec3 position;

            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
        void main() {
            gl_FragColor = vec4(1.0);
        }
        `
    });

    const mesh = new ogl.Mesh(gl, {geometry, program});
    mesh.setParent(scene);

    requestAnimationFrame(update);
    function update(t) {
        requestAnimationFrame(update);
        mesh.rotation.y -= 0.04;
        mesh.rotation.x += 0.03;
        renderer.render({scene, camera});
    }
}

const el = document.getElementById("main")
main(el);