import Ogle from './components/ogle';
import ShaderTester from './components/shader_tester';
import ShaderEditor from './components/editor';

// @ts-ignore
import vertex from './shaders/shader.vert';
// @ts-ignore
import fragment from './shaders/shader.frag';

window.onload = async function () {

  let canvas = document.getElementById("shader-view") as HTMLCanvasElement;
  let gl = canvas.getContext("webgl");

  const ogle = new Ogle(canvas, fragment, vertex);
  ogle.start();

  const shader_tester = new ShaderTester(gl);

  const editor_root = document.getElementById('monaco-editor');

  const on_change = (frag: string) => {
    const [ok, err] = shader_tester.test(frag);
    console.log(ok, err)
    if (ok) {
      ogle.set_frag(frag);
    }
  };

  const playpausebutton = document.getElementById("playpause");
  playpausebutton.onclick = function(e) {
    ogle.toggle();
  };

  const editor = new ShaderEditor(editor_root, fragment, on_change);
  await editor.colorize();
}