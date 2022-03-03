import REGL from 'regl';

export default class Ogle {
  regl: REGL.Regl;
  frag: string;
  draw_cmd: REGL.DrawCommand;
  cancel: REGL.Cancellable;
  running: boolean;

  constructor(canvas: HTMLCanvasElement, frag: string, vert: string) {
    this.regl = REGL(canvas);
    this.frag = frag;
    this.draw_cmd = this.regl({
      frag: this.regl.prop<{frag: string}, "frag">("frag"),
      vert: vert,
      attributes: {
        position: [[-1, -1], [3, -1], [-1, 3]],
        uv: [0, 0, 2, 0, 0, 2],
      },
      uniforms: {
        u_time: this.regl.context("time"),
        u_frame: this.regl.context("tick"),
      },
      count: 3,
    });
    this.running = false;
  }

  set_frag(frag: string) {
    this.frag = frag;
  }

  draw() {
    this.regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    })
    this.draw_cmd({frag: this.frag});
  }

  toggle() {
    if (this.running)
      this.stop();
    else
      this.start();
  }

  stop() {
    if (!this.running) {
      console.warn("Tried to stop already stopped ogle!");
      return;
    }
    this.running = false;
    this.cancel.cancel();
  }

  start() {
    if (this.running) {
      console.warn("Tried to start already running ogle!");
      return;
    }
    this.running = true;
    this.cancel = this.regl.frame((context: REGL.DefaultContext) => this.draw());
  }
}
