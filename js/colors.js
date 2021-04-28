class Color {
  constructor(H, S, L, A = 1) {
    this._H = H;
    this._S = S;
    this._L = L;
    this._A = A;
  }

  variate(amount) {
    this._H = wrap(this._H + amount, 0, 360);
  }

  get HSL() {
    return `hsl(${this._H}, ${this._S}%, ${this._L}%, ${this._A})`;
  }
}