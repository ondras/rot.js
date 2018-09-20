class XY {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	toString() { return this.x+","+this.y; }
	is(xy) { return (this.x==xy.x && this.y==xy.y); }
	dist8(xy) {
		let dx = xy.x-this.x;
		let dy = xy.y-this.y;
		return Math.max(Math.abs(dx), Math.abs(dy));
	}

	dist4(xy) {
		let dx = xy.x-this.x;
		let dy = xy.y-this.y;
		return Math.abs(dx) + Math.abs(dy);
	}

	dist(xy) {
		let dx = xy.x-this.x;
		let dy = xy.y-this.y;
		return Math.sqrt(dx*dx+dy*dy);
	}

	plus(xy) {
		return new XY(this.x+xy.x, this.y+xy.y);
	}

	minus(xy) {
		return new XY(this.x-xy.x, this.y-xy.y);
	}
}
