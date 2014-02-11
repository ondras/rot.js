var Entity = function() {
	this._xy = null;
	this._level = null;
}

Entity.prototype.getXY = function() {
	return this._xy;
}

Entity.prototype.getLevel = function() {
	return this._level;
}

Entity.prototype.setPosition = function(xy, level) {
	/* came to a currently active level; add self to the scheduler */
	if (level != this._level && level == Game.level) {
		Game.scheduler.add(this, true);
	}

	this._xy = xy;
	this._level = level;
	return this;
}
