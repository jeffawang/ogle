import Ogle from './components/ogle';
import REGL from 'regl';

// @ts-ignore
import vertex_shader from './shaders/shader.vert';
// @ts-ignore
import fragment_shader from './shaders/shader.frag';

let cancel;
window.onload = function() {

  let canvas = document.getElementById("shader-view") as HTMLCanvasElement;
  let gl = canvas.getContext("webgl");

  const shader_tester = new ShaderTester(gl);
  const [ok, err] = shader_tester.test(fragment_shader);
  console.log(ok, err)

  const regl = REGL(canvas);

  const draw = regl({
    frag: fragment_shader,
    vert: vertex_shader,
    attributes: {
      position: [[-1, -1], [3, -1], [-1, 3]],
      uv: [0, 0, 2, 0, 0, 2],
    },
    uniforms: {
      u_time: ({time}) => time,
      u_frame: ({tick}) => tick,
    },
    count: 3,

  });

{
  // let draw2
  // try {
  //   draw2 = regl({
  //     frag: fragment_shader + "jaowijef",
  //     vert: vertex_shader,
  //     attributes: {
  //       position: [[-1, -1], [3, -1], [-1, 3]],
  //       uv: [0, 0, 2, 0, 0, 2],
  //     },
  //     uniforms: {
  //       u_time: ({time}) => time,
  //       u_frame: ({tick}) => tick,
  //     },
  //     count: 3,

  //   });
  // } catch (error) {
  //   console.warn(error.stack);
  // }
}

  console.log("before")
  cancel = regl.frame((context: REGL.DefaultContext) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    })
    draw();
  })
}


class ShaderTester {
  tester: WebGLShader;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  source: string;
  last_error: string;

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
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