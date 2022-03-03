import REGL from 'regl';

export default class Ogle {
  regl: REGL.Regl;
  frag: string;
  draw_cmd: REGL.DrawCommand;
  cancel: REGL.Cancellable;

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
  }

  set_frag(frag: string) {
    this.frag = frag;
  }

  draw() {
    this.draw_cmd({frag: this.frag});
  }

  stop() {
    this.cancel.cancel();
  }

  start() {
    this.cancel = this.regl.frame((context: REGL.DefaultContext) => {
      this.regl.clear({
        color: [0, 0, 0, 1],
        depth: 1,
      })
      this.draw();
    });
  }
}
