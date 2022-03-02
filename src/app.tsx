import Ogle from './components/ogle';

// @ts-ignore
import vertex_shader from './shaders/shader.vert';
// @ts-ignore
import fragment_shader from './shaders/shader.frag';

const root = document.getElementById("main");
const ogle = new Ogle(root, vertex_shader, fragment_shader);
ogle.mount();

requestAnimationFrame(update);
function update(t) {
    requestAnimationFrame(update);
    ogle.render(t);
}
