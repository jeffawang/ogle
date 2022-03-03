import * as ogl from 'ogl-typescript';

type Uniforms = {
    u_time: {value: number},
    u_frame: {value: number},
    u_resolution: {value: ogl.Vec2},
};

export default class Ogle {
    root: HTMLElement;
    vertex: string;
    fragment: string;
    renderer: ogl.Renderer;
    mesh: ogl.Mesh;
    running: boolean;
    shader_tester: ShaderTester

    constructor(vertex: string, fragment: string) {
        this.vertex = vertex;
        this.fragment = fragment;
        this.renderer = new ogl.Renderer();
        const gl = this.renderer.gl;

        const geometry = new ogl.Geometry(gl, {
            position: {size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3])},
            uv: {size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2])},
        });

        const uniforms: Uniforms = {
            u_time: {value: 0},
            u_frame: {value: 0},
            u_resolution: {value: new ogl.Vec2()},
        }

        const program = new ogl.Program(gl, {
            vertex: this.vertex,
            fragment: this.fragment,
            uniforms,
        });

        this.mesh = new ogl.Mesh(gl, {geometry, program});
        this.shader_tester = new ShaderTester(gl);
        
        this.running = false;
    }

    mount(el: HTMLElement) {
        this.root = el;
        el.replaceChildren(this.renderer.gl.canvas);
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        const w = this.root.clientWidth;
        const h = this.root.clientHeight;
        this.mesh.program.uniforms.u_resolution.value.x = w;
        this.mesh.program.uniforms.u_resolution.value.y = h;
        this.renderer.setSize(w, h);
    }

    update(t) {
        this.mesh.program.uniforms.u_time.value = t * 0.001;
        this.mesh.program.uniforms.u_frame.value += 1;
        this.renderer.render({scene: this.mesh});
        
        if (this.running) {
            requestAnimationFrame(this.update.bind(this));
        }
    }

    set_shader(fragment: string) {
        console.log("SETTING SHADER");
        this.fragment = fragment;

        const gl = this.mesh.gl;

        const [ok, msg] = this.shader_tester.test(fragment);

        if (!ok) {
            console.warn(msg);
            return;
        }

        const program = new ogl.Program(this.mesh.gl, {
            vertex: this.vertex,
            fragment: this.fragment,
            uniforms: this.mesh.program.uniforms,
        });
        this.mesh.program = program;
    }

    start() {
        this.running = true;
        requestAnimationFrame(this.update.bind(this));
    }

    stop() {
        this.running = false;
    }
}

class ShaderTester {
    tester: WebGLShader;
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    source: string;
    last_error: string;

    constructor(gl: ogl.OGLRenderingContext) {
        this.gl = gl;
        this.tester = gl.createShader(gl.FRAGMENT_SHADER);
    }

    test(fragment: string): [boolean, string] {
        this.source = fragment;
        this.gl.shaderSource(this.tester, fragment);
        this.gl.compileShader(this.tester);
        this.last_error = this.gl.getShaderInfoLog(this.tester);
        return [this.last_error === '', this.last_error];
    }
}