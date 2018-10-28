class TextBuffer {
	constructor() {
		this._data = [];
		this._options = {
			display: null,
			position: new XY(),
			size: new XY()
		}
	}

	configure(options) { Object.assign(this._options, options); }
	clear() { this._data = []; }
	write(text) { this._data.push(text); }

	flush() {
		let o = this._options;
		let d = o.display;
		let pos = o.position;
		let size = o.size;

		// clear
		for (let i=0;i<size.x;i++) {
			for (let j=0;j<size.y;j++) {
				d.draw(pos.x+i, pos.y+j);
			}
		}

		let text = this._data.join(" ");
		d.drawText(pos.x, pos.y, text, size.x);
	}
}
