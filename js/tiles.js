class Tile {
  constructor(x, y, scl, palette, background_color) {
    this._x = x;
    this._y = y;

    this._palette = [...palette];
    this._background_color = background_color;

    this._border = 0.1;
    this._scl = scl * (1 - this._border);
    this._border_dpos = this._border * scl / 2;

    this._rotation = random_int(4) * Math.PI / 2;

    this._biases = [
      { bias: 16, }, // 0 two arches (side by side)
      { bias: 16, }, // 1 two arches (superimposed)
      { bias: 15, }, // 2 two rects (side by side)
      { bias: 10, }, // 3 two rects (superimposed)
      { bias: 5, }, // 4 one circle in the middle
      { bias: 5, }, // 5 two circles
      { bias: 10, }, // 6 triangle
      { bias: 15, }, // 7 two triangles with touching tops
      { bias: 15, }, // 8 diagonally separated colors
      { bias: 10, }, // 9 alternating lines
      { bias: 4, }, // 10 rectangle with holes
      { bias: 4, }, // 11 circles grid
      { bias: 50, }, // EMPTY
    ];
    for (let i = 0; i < this._biases.length; i++) this._biases[i].mode = i;

    this._biases = normalize_bias(this._biases);

    const choiche = random();
    for (let i = 0; i < this._biases.length; i++) {
      if (this._biases[i].cumulative > choiche) {
        this._mode = this._biases[i].mode;
        break;
      }
    }

    //this._rotation = 0;
    //this._mode = 11;
  }

  show(ctx) {
    ctx.save();
    // TODO translate so position is relative to top left corner
    ctx.translate(this._x + this._scl / 2, this._y + this._scl / 2);
    // translate to account for border
    ctx.translate(this._border_dpos, this._border_dpos);
    ctx.rotate(this._rotation);

    if (this._mode == 0) {
      // two arches (side by side)
      const rho = this._scl / 2;
      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = this._palette[i];
        ctx.rotate(Math.PI * i);
        ctx.beginPath();
        ctx.arc(-this._scl / 2, 0, rho, Math.PI / 2, -Math.PI / 2, true);
        ctx.fill();
      }
      ctx.restore();
    } else if (this._mode == 1) {
      // two arches (superimposed)
      const rho = this._scl / 2;
      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = this._palette[i];
        ctx.rotate(Math.PI * i / 2);
        ctx.beginPath();
        ctx.arc(-this._scl / 2, 0, rho, Math.PI / 2, -Math.PI / 2, true);
        ctx.fill();
      }
      ctx.restore();
    } else if (this._mode == 2) {
      // two rects (side by side)
      const width = this._scl / 2;
      const height = this._scl;
      ctx.save();
      ctx.translate(-this._scl / 2, -this._scl / 2);
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = this._palette[i];
        ctx.fillRect(width * i, 0, width, height);
      }
      ctx.restore();
    } else if (this._mode == 3) {
      // two rects (superimposed)
      const width = this._scl / 2;
      const height = this._scl;
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.rotate(Math.PI / 2 * i);
        ctx.translate(-this._scl / 2, -this._scl / 2);
        ctx.fillStyle = this._palette[i];
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    } else if (this._mode == 4) {
      // one circle in the middle
      const rho = this._scl / 4;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this._palette[0];
      ctx.arc(0, 0, rho, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this._mode == 5) {
      // two circles
      const rho = this._scl / 8;
      ctx.save();
      ctx.rotate(Math.PI / 4);
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.rotate(Math.PI * i);
        ctx.translate(2 * rho, 0);
        ctx.beginPath();
        ctx.fillStyle = this._palette[i];
        ctx.arc(0, 0, rho, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    } else if (this._mode == 6) {
      // triangle
      ctx.save();
      ctx.translate(-this._scl / 2, -this._scl / 2);
      ctx.fillStyle = this._palette[0];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this._scl / 2, this._scl / 2);
      ctx.lineTo(this._scl, 0);
      ctx.fill();
      ctx.restore();
    } else if (this._mode == 7) {
      // two triangles with touching tops
      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.rotate(Math.PI * i);
        ctx.translate(-this._scl / 2, -this._scl / 2);
        ctx.fillStyle = this._palette[i];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this._scl / 2, this._scl / 2);
        ctx.lineTo(this._scl, 0);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    } else if (this._mode == 8) {
      // diagonally separated colors
      ctx.save();
      ctx.translate(-this._scl / 2, -this._scl / 2);
      ctx.fillStyle = this._palette[0];
      ctx.fillRect(0, 0, this._scl, this._scl);
      ctx.fillStyle = this._palette[1];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this._scl, this._scl);
      ctx.lineTo(0, this._scl);
      ctx.fill();
      ctx.restore();
    } else if (this._mode == 9) {
      // alternating lines
      const items = 4;
      const height = this._scl / (items * 2);
      const width = this._scl / 2;
      ctx.save();
      ctx.translate(-this._scl / 2, - this._scl / 2);
      for (let i = 0; i < 2; i++) {
        const dx = width * i;
        const dy = height * i;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.fillStyle = this._palette[i];
        for (let j = 0; j < items; j++) {
          ctx.fillRect(0, 0, width, height);
          ctx.translate(0, height * 2);
        }
        ctx.restore();
      }
      ctx.restore();
    } else if (this._mode == 10) {
      // rectangle with holes
      const holes = 4;
      const scl = this._scl / holes;
      const rho = scl * 0.25;

      ctx.save();
      ctx.translate(-this._scl / 2, -this._scl / 2);
      ctx.fillStyle = this._palette[0];
      ctx.fillRect(0, 0, this._scl, this._scl);
      ctx.fillStyle = this._background_color;
      ctx.translate(scl / 2, scl / 2);
      for (let x = 0; x < holes; x++) {
        for (let y = 0; y < holes; y++) {
          ctx.beginPath();
          ctx.arc(x * scl, y * scl, rho, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (this._mode == 11) {
      // circles grid
      const circles = 3;
      const scl = this._scl / circles;
      const rho = scl * 0.25;

      ctx.save();
      ctx.translate(-this._scl / 2, -this._scl / 2);
      ctx.fillStyle = this._palette[0];
      ctx.translate(scl / 2, scl / 2);
      for (let x = 0; x < circles; x++) {
        for (let y = 0; y < circles; y++) {
          ctx.beginPath();
          ctx.arc(x * scl, y * scl, rho, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    ctx.restore();
  }
}