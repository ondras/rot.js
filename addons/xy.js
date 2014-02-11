var XY = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

XY.prototype.toString = function() {
	return this.x+","+this.y;
}

XY.prototype.is = function(xy) {
	return (this.x==xy.x && this.y==xy.y);
}

XY.prototype.dist8 = function(xy) {
	var dx = xy.x-this.x;
	var dy = xy.y-this.y;
	return Math.max(Math.abs(dx), Math.abs(dy));
}

XY.prototype.dist4 = function(xy) {
	var dx = xy.x-this.x;
	var dy = xy.y-this.y;
	return Math.abs(dx) + Math.abs(dy);
}

XY.prototype.dist = function(xy) {
	var dx = xy.x-this.x;
	var dy = xy.y-this.y;
	return Math.sqrt(dx*dx+dy*dy);
}

XY.prototype.plus = function(xy) {
	return new XY(this.x+xy.x, this.y+xy.y);
}

XY.prototype.minus = function(xy) {
	return new XY(this.x-xy.x, this.y-xy.y);
}
