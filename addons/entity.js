var Entity = function(visual) {
	this._visual = visual;
	this._xy = null;
	this._level = null;
}

Entity.prototype.getVisual = function() {
	return this._visual;
}

Entity.prototype.getXY = function() {
	return this._xy;
}

Entity.prototype.getLevel = function() {
	return this._level;
}

Entity.prototype.setPosition = function(xy, level) {
	this._xy = xy;
	this._level = level;
	return this;
}
