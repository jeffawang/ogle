import Ogle from './components/ogle';

// @ts-ignore
import vertex_shader from './shaders/shader.vert';
// @ts-ignore
import fragment_shader from './shaders/shader.frag';

window.onload = function() {
  const shader_view = document.getElementById("shader-view");
  initialize_ogle(shader_view);

}

function initialize_ogle(root: HTMLElement) {
  const ogle = new Ogle(vertex_shader, fragment_shader);
  ogle.mount(root);
  ogle.start();
}