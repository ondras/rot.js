class Entity {
	constructor(visual) {
		this._visual = visual;
		this._xy = null;
		this._level = null;
	}

	getVisual() { return this._visual; }
	getXY() { return this._xy; }
	getLevel() { return this._level; }

	setPosition(xy, level) {
		this._xy = xy;
		this._level = level;
		return this;
	}
}
