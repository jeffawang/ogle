import REGL from 'regl';

export default class Ogle {
  regl: REGL.Regl;
  vert: string;
  frag: string;
  cmd: REGL.DrawCommand;
  cancel: REGL.Cancellable;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, frag: string, vert: string) {
    this.canvas = canvas;
    this.frag = frag;
    this.vert = vert;

    this.set_frag(frag);
  }

  set_frag(frag: string) {
    if (this.regl) {
      if (this.cancel)
        this.cancel.cancel();
      this.regl.destroy()
    }
    this.regl = REGL(this.canvas);
    this.frag = frag;
    this.cmd = this.regl({
      frag: this.frag,
      vert: this.vert,
      attributes: {
        position: [[-1, -1], [3, -1], [-1, 3]],
        uv: [0, 0, 2, 0, 0, 2],
      },
      uniforms: {
        u_time: ({ time }) => time,
        u_frame: ({ tick }) => tick,
      },
      count: 3,
    });
  }

  draw() {
    this.cmd();
  }

  start() {
    this.cancel = this.regl.frame((context: REGL.DefaultContext) => {
      this.regl.clear({
        color: [0, 0, 0, 1],
        depth: 1,
      })
      this.cmd();
    });
  }
}
