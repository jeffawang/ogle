// import Ogle from './components/ogle';
import REGL, { Regl } from 'regl';

// @ts-ignore
import vertex_shader from './shaders/shader.vert';
// @ts-ignore
import fragment_shader from './shaders/shader.frag';

import * as monaco from 'monaco-editor';
import { threadId } from 'worker_threads';

window.onload = function() {



  let canvas = document.getElementById("shader-view") as HTMLCanvasElement;
  let gl = canvas.getContext("webgl");
  const shader_tester = new ShaderTester(gl);

  const editor = monaco.editor.create(/** @type {HTMLElement} */ (document.getElementById('monaco-editor')), {
    value: fragment_shader,
    language: 'glsl',
    minimap: {enabled: false},
    theme: 'vs'
  });

  monaco.editor.setModelMarkers(editor.getModel(), "owner", [{
    startLineNumber: 1,
    severity: monaco.MarkerSeverity.Error,
    message: "wtf are you doing",
    startColumn: 1,
    endLineNumber: 3,
    endColumn: 100
  }]);


  editor.getModel().onDidChangeContent((event) => {
    const value = editor.getValue();
    const [ok, err] = shader_tester.test(value);
    console.log(ok, err)
  })

  const ogle = new Ogle(canvas, fragment_shader, vertex_shader);
  ogle.start();

  window.addEventListener("resize", (_) => (editor.layout()));

  // const regl = REGL(canvas);

  // const draw = regl({
  //   frag: fragment_shader,
  //   vert: vertex_shader,
  //   attributes: {
  //     position: [[-1, -1], [3, -1], [-1, 3]],
  //     uv: [0, 0, 2, 0, 0, 2],
  //   },
  //   uniforms: {
  //     u_time: ({time}) => time,
  //     u_frame: ({tick}) => tick,
  //   },
  //   count: 3,

  // });

  // let cancel = regl.frame((context: REGL.DefaultContext) => {
  //   regl.clear({
  //     color: [0, 0, 0, 1],
  //     depth: 1,
  //   })
  //   draw();
  // })
}

class Ogle {
  regl: REGL.Regl;
  vert: string;
  frag: string;
  cmd: REGL.DrawCommand;

  constructor(canvas: HTMLCanvasElement, frag: string, vert: string) {
    this.regl = REGL(canvas);
    this.frag = frag;
    this.vert = vert;

    this.set_frag(frag);
  }

  set_frag(frag: string) {
    this.frag = frag;
    this.cmd = this.regl({
      frag: this.frag,
      vert: this.vert,
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
  }

  draw() {
    this.cmd();
  }

  start() {
    this.regl.frame((context: REGL.DefaultContext) => {
      this.regl.clear({
        color: [0, 0, 0, 1],
        depth: 1,
      })
      this.cmd();
    });
  }
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