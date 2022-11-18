export class HEXColor {
	constructor(r, g, b) {
    this.redHex = r.toString(16).padStart(2, '0');
    this.greenHex = g.toString(16).padStart(2, '0');
    this.blueHex = b.toString(16).padStart(2, '0');

		this.hexString = `#${this.redHex}${this.greenHex}${this.blueHex}`
  }
}
