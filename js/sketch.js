class Sketch extends Engine {
  preload() {
    // parameters
    this._cols = 9;
    this._border = 0.1;
    this._background_color = "hsl(35, 49%, 86%)";
    this._palette = [
      { color: new Color(209, 99, 34), bias: 8, }, // blue
      { color: new Color(44, 89, 57), bias: 5, }, // yellow
      { color: new Color(358, 86, 52), bias: 8, }, // red
      { color: new Color(340, 9, 13), bias: 0.75, } // black
    ];
    this._particles_number = 12000; // texture particles

    // max color variation
    this._max_variation = 5;
    // setup download button
    document.querySelector("#download").addEventListener("click", () => this._download());
  }

  setup() {
    console.clear();

    // border calculations
    const inner_size = this.width * (1 - this._border);
    const inner_border = this._border * this.width;
    // size and displacement calculations
    const scl = inner_size / this._cols;
    const dpos = inner_border / 2;

    // hue variation
    const hue_variation = random_interval(0, this._max_variation);
    this._palette.forEach(p => p.color.variation = hue_variation);

    // create tiles
    this._tiles = [];
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._cols; y++) {
        // copy the palette
        let palette = [...this._palette];
        // initialize tile palette
        let tile_palette = [];
        // pick numbers and color
        for (let i = 0; i < 2; i++) {
          // normalize the bias
          palette = normalize_bias(palette);
          // pick a number randomly
          let choice;
          choice = random();
          for (let j = 0; j < palette.length; j++) {
            if (palette[j].cumulative > choice) {
              // if the bias is bigger that the choice, this is the 
              // color we are looking for. remove it from palette 
              // and repeat.
              const new_color = palette.splice(j, 1)[0].color;
              tile_palette.push(new_color.HSL);
              break;
            }
          }
        }

        // create and append new tile to array
        const new_tile = new Tile(x * scl + dpos, y * scl + dpos, scl, tile_palette, this._background_color);
        this._tiles.push(new_tile);
      }
    }

    // create particles to add some "old" texture
    this._particles = [];
    for (let i = 0; i < this._particles_number; i++) this._particles.push(new Particle(this.width));

    // create signature
    this._signature = new Signature(this.width);
  }

  draw() {
    // background
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this._background_color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();

    // draw tiles
    this._tiles.forEach(t => t.show(this.ctx));
    // draw particles
    this._particles.forEach(p => p.show(this._ctx));
    // draw signature
    this._signature.show(this.ctx);

    // stop looping, there's no need to keep refreshing
    this.noLoop();
  }

  click() {
    this.setup();
    this.loop();
  }

  _download() {
    this.saveAsImage("bauhaus-time!");
  }
}


const normalize_bias = arr => {
  // copy the array by value
  arr = [...arr];
  // first sort palette by bias
  arr = arr.sort((a, b) => a.bias - b.bias);
  // normalize bias so that the sum is 1
  let sum = 0;
  let cumulative = arr.map(a => sum += a.bias);
  // normalization
  cumulative = cumulative.map(a => a /= sum);
  // integrate in palette
  for (let i = 0; i < arr.length; i++) arr[i].cumulative = cumulative[i];
  return arr;
};