class Color {
  constructor(H, S, L) {
    this._H = H;
    this._S = S;
    this._L = L;


    this._variation = 0;
  }

  get HSL() {
    const H = wrap(this._H + this._variation, 0, 360);
    return `hsl(${H}, ${this._S}%, ${this._L}%, 1)`;
  }

  get variation() {
    return this._variation;
  }

  set variation(v) {
    this._variation = v;
  }
}