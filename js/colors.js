class Color {
  constructor(H, S, L, A = 1) {
    this._H = H;
    this._S = S;
    this._L = L;
    this._A = A;

    this._variation = 0;
  }

  get HSL() {
    const H = wrap(this._H + this._variation, 0, 360);
    return `hsl(${this._H}, ${this._S}%, ${this._L}%, ${this._A})`;
  }

  get variation() {
    return this._variation;
  }

  set variation(v) {
    this._variation = v;
  }
}