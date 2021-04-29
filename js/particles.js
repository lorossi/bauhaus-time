class Particle {
  constructor(size) {
    this._x = random_int(size);
    this._y = random_int(size);

    this._alpha = random(1, 6) / 100;
    this._channel = random_interval(100, 20);
    this._scl = 3;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);
    ctx.fillStyle = `rgba(${this._channel}, ${this._channel}, ${this._channel}, ${this._alpha})`;
    ctx.fillRect(0, 0, this._scl, this._scl);
    ctx.restore();
  }
}