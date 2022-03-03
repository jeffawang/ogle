import Ogle from './components/ogle';

// @ts-ignore
import vertex_shader from './shaders/shader.vert';
// @ts-ignore
import fragment_shader from './shaders/shader.frag';

window.onload = function() {
  const shader_view = document.getElementById("shader-view");
  const shader_editor = document.getElementById("editor");

  const ogle = initialize_ogle(shader_view);
  shader_editor.textContent = fragment_shader;
  shader_editor.addEventListener("input", function(e) {
    // console.log("update")
    ogle.set_shader(e.target.value);
  });
}

function initialize_ogle(root: HTMLElement): Ogle {
  const ogle = new Ogle(vertex_shader, fragment_shader);
  ogle.mount(root);
  ogle.start();
  ogle.set_shader(fragment_shader);
  return ogle;
}