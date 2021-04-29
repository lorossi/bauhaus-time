class Title {
  constructor(size) {
    this._size = size;

    this._channel = 30;
    this._alpha = 1;
    this._font_size = 40;
    this._pos = this._font_size / 2;
    this._title = Math.floor(Math.random() * Math.pow(10, 6));
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._pos, this._pos);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = `rgba(${this._channel}, ${this._channel}, ${this._channel}, ${this._alpha})`;
    ctx.font = `${this._font_size}px Bauhaus`;
    ctx.fillText(this._title, 0, 0);
    ctx.restore();
  }

  get piece_title() {
    return this._title;
  }

}

class Signature {
  constructor(size) {
    this._size = size;

    this._channel = 30;
    this._alpha = 1;
    this._font_size = 25;
    this._pos = this._size - this._font_size / 2;
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