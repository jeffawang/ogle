type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

export default class ShaderTester {
  tester: WebGLShader;
  gl: GLContext;
  source: string;
  last_error: string;

  constructor(gl: GLContext) {
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