class Engine {
  constructor(canvas, ctx, fps = 60) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._fps = fps;

    // init variables
    this._frameCount = 0;
    this._frameRate = 0;
    this._noLoop = false;
    this._fpsBuffer = new Array(0).fill(this._fps);
    // start sketch
    this._setFps();
    this._run();
  }

  _setFps() {
    // keep track of time to handle fps
    this.then = performance.now();
    // time between frames
    this._fps_interval = 1 / this._fps;
  }

  _run() {
    // bootstrap the sketch
    this.preload();
    this.setup();
    // anti alias
    this._ctx.imageSmoothingQuality = "high";
    this._timeDraw();
  }

  _timeDraw() {
    // request another frame
    window.requestAnimationFrame(this._timeDraw.bind(this));

    if (this._noLoop) return;

    let diff;
    diff = performance.now() - this.then;
    if (diff < this._fps_interval) {
      // not enough time has passed, so we request next frame and give up on this render
      return;
    }
    // updated last frame rendered time
    this.then = performance.now();
    // now draw
    this._ctx.save();
    this.draw();
    this._ctx.restore();
    // update frame count
    this._frameCount++;
    // update fpsBuffer
    this._fpsBuffer.unshift(1000 / diff);
    this._fpsBuffer = this._fpsBuffer.splice(0, 30);
    // calculate average fps
    this._frameRate = this._fpsBuffer.reduce((a, b) => a + b, 0) / this._fpsBuffer.length;
  }

  _calculate_press_coords(e) {
    // calculate size ratio
    const boundingBox = this._canvas.getBoundingClientRect();
    const ratio = Math.min(boundingBox.width, boundingBox.height) / this._canvas.getAttribute("width");
    // calculate real mouse/touch position
    if (!e.touches) {
      // we're dealing with a mouse
      const mx = (e.pageX - boundingBox.left) / ratio;
      const my = (e.pageY - boundingBox.top) / ratio;
      return { x: mx, y: my };
    } else {
      // we're dealing with a touchscreen
      const tx = (e.touches[0].pageX - boundingBox.left) / ratio;
      const ty = (e.touches[0].pageY - boundingBox.top) / ratio;
      return { x: tx, y: ty };
    }

  }

  loop() {
    this._noLoop = false;
  }

  noLoop() {
    this._noLoop = true;
  }

  click(e) {
    //const coords = this._calculate_press_coords(e);
  }

  mousedown(e) {
    this._mouse_pressed = true;
  }

  mouseup(e) {
    this._mouse_pressed = false;
  }

  mousemove(e) {
    if (this._mouse_pressed) {

    }
  }

  touchdown(e) {
    this.mousedown(e);
  }

  touchup(e) {
    this.mouseup(e);
  }

  touchmove(e) {
    this.mousemove(e);
  }

  keydown(e) {
    //console.log({ code: e.code });
  }

  saveFrame() {
    const title = "frame-" + this._frameCount.toString().padStart(6, 0);
    this.saveAsImage(title);
  }

  saveAsImage(title) {
    let container;
    container = document.createElement("a");
    container.download = title + ".png";
    container.href = this._canvas.toDataURL("image/png");
    document.body.appendChild(container);

    container.click();
    document.body.removeChild(container);
  }

  background(color) {
    // reset background
    this._ctx.save();
    // reset canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    // set background
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  preload() {
    // ran once
  }

  setup() {
    // ran once
  }

  draw() {
    // ran continuosly
  }

  get ctx() {
    return this._ctx;
  }

  get frameCount() {
    return this._frameCount;
  }

  get frameRate() {
    return this._frameRate;
  }

  set frameRate(f) {
    this._setFps(f);
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

}

document.addEventListener("DOMContentLoaded", () => {
  // page loaded
  let canvas, ctx, s;
  canvas = document.querySelector("#sketch");
  // inject canvas in page
  if (canvas.getContext) {
    ctx = canvas.getContext("2d", { alpha: false });
    s = new Sketch(canvas, ctx);
  }

  // mouse event listeners
  canvas.addEventListener("click", e => s.click(e));
  canvas.addEventListener("mousedown", e => s.mousedown(e));
  canvas.addEventListener("mouseup", e => s.mouseup(e));
  canvas.addEventListener("mousemove", e => s.mousemove(e));
  // touchscreen event listensers
  canvas.addEventListener("touchstart", e => s.touchdown(e));
  canvas.addEventListener("touchend", e => s.touchup(e));
  canvas.addEventListener("touchmove", e => s.touchmove(e));
  // keyboard event listeners
  document.addEventListener("keydown", e => s.keydown(e));
});
