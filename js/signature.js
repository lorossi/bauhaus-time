class Signature {
  constructor(size) {
    this._channel = 50;
    this._alpha = 0.5;
    this._font_size = 30;

    this._pos = size - this._font_size / 2;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._pos, this._pos);
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = `rgba(${this._channel}, ${this._channel}, ${this._channel}, ${this._alpha})`;
    ctx.font = `${this._font_size}px Bauhaus`;
    ctx.fillText("Lorenzo Rossi", 0, 0);
    ctx.restore();
  }
}