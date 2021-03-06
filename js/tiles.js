class Tile {
  constructor(x, y, scl, palette, background_color) {
    this._x = x;
    this._y = y;

    this._palette = [...palette];
    this._background_color = background_color;

    this._border = 0.1;
    this._scl = scl * (1 - this._border);
    this._border_dpos = this._border * scl / 2;

    // random rotation with some small offset (emulates hand imprecision)
    this._rotation = random_int(4) * Math.PI / 2 + random_normal(-0.0001, 0.0001);

    this._modes = [
      { bias: 15, mode: "TWO_ARCHES", }, // 0 two arches (side by side)
      { bias: 15, mode: "TWO_SUPERIMPOSED_ARCHES", }, // 1 two arches (superimposed)
      { bias: 5, mode: "TWO_RECTS", }, // 2 two rects (side by side)
      { bias: 10, mode: "TWO_SUPERIMPOSED_RECTS", }, // 3 two rects (superimposed)
      { bias: 10, mode: "CIRCLE", }, // 4 one circle in the middle
      { bias: 10, mode: "TWO_CIRCLES", }, // 5 two circles
      { bias: 10, mode: "TRIANGLE" }, // 6 triangle
      { bias: 15, mode: "TWO_TRIANGLES", }, // 7 two triangles with touching tops
      { bias: 5, mode: "DIAGONAL", }, // 8 diagonally separated colors
      { bias: 5, mode: "ALTERNATING", }, // 9 alternating lines
      { bias: 5, mode: "RECTANGLE_WITH_HOLES", }, // 10 rectangle with holes
      { bias: 5, mode: "CIRCLES_GRID", }, // 11 circles grid
      { bias: 5, mode: "ANGULAR_TRIANGLE", }, // 12 angular triangle
      { bias: 5, mode: "HOLLOW_CIRCLE", }, // 13 hollow circle
      { bias: 5, mode: "HOLLOW_SQUARE", }, // 14 hollow square
      { bias: 10, mode: "PLUS", }, // 15 plus sign
      { bias: 10, mode: "SQUARE", }, // 16 square
      { bias: 5, mode: "QUARTER_ARCH", }, // 17 quarter arch
      { bias: 65, mode: "EMPTY" }, // EMPTY
    ];

    // normalize the bias in range 0-1
    this._modes = normalize_bias(this._modes);
    // pick a random mode
    const choice = random();
    for (let i = 0; i < this._modes.length; i++) {
      if (this._modes[i].cumulative > choice) {
        this._mode = this._modes[i].mode;
        break;
      }
    }
  }

  show(ctx) {
    ctx.save();
    // translate so position is relative to top left corner
    ctx.translate(this._x + this._border_dpos, this._y + this._border_dpos);
    // rotate
    ctx.translate(this._scl / 2, this._scl / 2);
    ctx.rotate(this._rotation);
    ctx.translate(-this._scl / 2, -this._scl / 2);

    ctx.strokeStyle = this._background_color;

    if (this._mode == "TWO_ARCHES") {
      // two arches (side by side)
      const rho = this._scl / 2;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = this._palette[i];
        ctx.rotate(Math.PI * i);
        ctx.beginPath();
        ctx.arc(-this._scl / 2, 0, rho, Math.PI / 2, -Math.PI / 2, true);
        ctx.fill();
      }
      ctx.restore();
    } else if (this._mode == "TWO_SUPERIMPOSED_ARCHES") {
      // two arches (superimposed)
      const rho = this._scl / 2;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = this._palette[i];
        ctx.rotate(Math.PI * i / 2);
        ctx.beginPath();
        ctx.arc(-this._scl / 2, 0, rho, Math.PI / 2, -Math.PI / 2, true);
        ctx.fill();
      }
      ctx.restore();
    } else if (this._mode == "TWO_RECTS") {
      // two rects (side by side)
      const width = this._scl / 2;
      const height = this._scl;

      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = this._palette[i];
        ctx.fillRect(width * i, 0, width, height);
      }
      ctx.restore();
    } else if (this._mode == "TWO_SUPERIMPOSED_RECTS") {
      // two rects (superimposed)
      const width = this._scl / 2;
      const height = this._scl;

      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.translate(this._scl / 2, this._scl / 2);
        ctx.rotate(Math.PI / 2 * i);
        ctx.translate(-this._scl / 2, -this._scl / 2);

        ctx.fillStyle = this._palette[i];
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    } else if (this._mode == "CIRCLE") {
      // one circle in the middle
      const rho = this._scl / 4;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);
      ctx.beginPath();
      ctx.fillStyle = this._palette[0];
      ctx.arc(0, 0, rho, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this._mode == "TWO_CIRCLES") {
      // two circles
      const rho = this._scl / 8;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);
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
    } else if (this._mode == "TRIANGLE") {
      // triangle
      const height = this._scl;

      ctx.save();
      ctx.fillStyle = this._palette[0];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(height / 2, height);
      ctx.lineTo(height, 0);
      ctx.fill();
      ctx.restore();
    } else if (this._mode == "TWO_TRIANGLES") {
      // two triangles with touching tops
      const height = this._scl / 2;

      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.translate(this._scl / 2, this._scl / 2);
        ctx.rotate(Math.PI * i);
        ctx.translate(-this._scl / 2, -this._scl / 2);

        ctx.fillStyle = this._palette[i];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(height, height);
        ctx.lineTo(height * 2, 0);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    } else if (this._mode == "DIAGONAL") {
      // diagonally separated colors
      const height = this._scl;

      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.translate(this._scl / 2, this._scl / 2);
        ctx.rotate(Math.PI * i);
        ctx.translate(-this._scl / 2, -this._scl / 2);

        ctx.fillStyle = this._palette[i];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(height, height);
        ctx.lineTo(0, height);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    } else if (this._mode == "ALTERNATING") {
      // alternating lines
      const items = 4;
      const height = this._scl / (items * 2);
      const width = this._scl / 2;

      ctx.save();
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
    } else if (this._mode == "RECTANGLE_WITH_HOLES") {
      // rectangle with holes
      const holes = 4;
      const scl = this._scl / holes;
      const rho = scl * 0.25;

      ctx.save();
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
    } else if (this._mode == "CIRCLES_GRID") {
      // circles grid
      const circles = 3;
      const scl = this._scl / circles;
      const rho = scl * 0.25;

      ctx.save();
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
    } else if (this._mode == "ANGULAR_TRIANGLE") {
      // angular triangle
      const height = this._scl;
      ctx.save();
      ctx.fillStyle = this._palette[0];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(height, height);
      ctx.lineTo(0, height);
      ctx.fill();
      ctx.restore();
    } else if (this._mode == "HOLLOW_CIRCLE") {
      // hollow circle
      const rho = this._scl / 2;
      const weight = this._scl / 2 * 0.5;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);

      ctx.fillStyle = this._palette[0];
      ctx.beginPath();
      ctx.arc(0, 0, rho, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = this._background_color;
      ctx.beginPath();
      ctx.arc(0, 0, weight, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();
    } else if (this._mode == "HOLLOW_SQUARE") {
      // hollow square
      const side = this._scl;
      const weight = this._scl / 2 * 0.9;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);

      ctx.fillStyle = this._palette[0];
      ctx.fillRect(-side / 2, -side / 2, side, side);

      ctx.fillStyle = this._background_color;
      ctx.fillRect(-weight / 2, -weight / 2, weight, weight);

      ctx.restore();
    } else if (this._mode == "PLUS") {
      // plus sign
      const height = this._scl;
      const width = this._scl / 4;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);

      ctx.fillStyle = this._palette[0];
      ctx.fillRect(-width / 2, -height / 2, width, height);

      ctx.rotate(Math.PI / 2);
      ctx.fillRect(-width / 2, -height / 2, width, height);

      ctx.restore();

    } else if (this._mode == "SQUARE") {
      // square 
      const side = this._scl * 0.75;

      ctx.save();
      ctx.translate(this._scl / 2, this._scl / 2);
      ctx.fillStyle = this._palette[0];
      ctx.fillRect(-side / 2, -side / 2, side, side);
      ctx.restore();
    } else if (this._mode == "QUARTER_ARCH") {
      // arch on the side
      const rho = this._scl;

      ctx.save();
      ctx.fillStyle = this._palette[0];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, rho, 0, Math.PI / 2);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}