import * as ogl from 'ogl-typescript';

type Uniforms = {
    u_time: {value: number},
    u_frame: {value: number},
    u_resolution: {value: ogl.Vec2},
};

export default class Ogle<U> {
    root: HTMLElement;
    vertex: string;
    fragment: string;
    renderer: ogl.Renderer;
    mesh: ogl.Mesh;

    constructor(root: HTMLElement, vertex: string, fragment: string) {
        this.root = root;
        this.vertex = vertex;
        this.fragment = fragment;
    }

    mount() {
        this.renderer = new ogl.Renderer();
        const gl = this.renderer.gl;
        this.root.replaceChildren(gl.canvas);

        const geometry = new ogl.Geometry(gl, {
            position: {size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3])},
            uv: {size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2])},
        });

        const uniforms: Uniforms = {
            u_time: {value: 0},
            u_frame: {value: 0},
            u_resolution: {value: new ogl.Vec2(this.root.clientWidth, this.root.clientHeight)},
        }

        const program = new ogl.Program(gl, {
            vertex: this.vertex,
            fragment: this.fragment,
            uniforms,
        });

        this.mesh = new ogl.Mesh(gl, {geometry, program});
    }

    resize() {
        const w = this.root.clientWidth;
        const h = this.root.clientHeight;
        this.mesh.program.uniforms.u_resolution.value.x = w;
        this.mesh.program.uniforms.u_resolution.value.y = h;
        this.renderer.setSize(w, h);
    }

    render(t: number) {
        this.mesh.program.uniforms.u_time.value = t * 0.001;
        this.mesh.program.uniforms.u_frame.value += 1;
        this.renderer.render({scene: this.mesh});
    }
}