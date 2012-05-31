ROT.Map.Feature = function() {}
ROT.Map.Feature.prototype.isValid = function(canBeDugCallback) {}
ROT.Map.Feature.prototype.dig = function(digCallback, wallCallback) {}

ROT.Map.Feature.Corridor = function(x1, y1, x2, y2) {
	this._x1 = x1;
	this._y1 = y1;
	this._x2 = x2;
	this._y2 = y2;
}
ROT.Map.Feature.Room.extend(ROT.Map.Feature);

ROT.Map.Feature.Room.prototype.isValid = function(canBeDugCallback){ 
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;
	
	var badCount = 0;
	
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (!canBeDugCallback(x, y)) { badCount++; }
			if (badCount > 1) { return false; } /* one bad (empty) is allowed */
		}
	}

	return true;
}

ROT.Map.Feature.Room.prototype.dig = function(digCallback, wallCallback){ 
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;
	
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x == left || x == right || y == top || y == bottom) {
				if (digCallback) { digCallback(x, y); }
			} else {
				if (wallCallback) { wallCallback(x, y); }
			}
		}
	}
}


ROT.Map.Feature.Corridor = function(startX, startY, endX, endY) {
	this._startX = startX;
	this._startY = startY;
	this._endX = endX;
	this._endY = endY;
}
ROT.Map.Feature.Corridor.extend(ROT.Map.Feature);

ROT.Map.Feature.Corridor.prototype.isValid = function(canBeDugCallback){ 
	var sx = this._startX;
	var sy = this._startY;
	var dx = this._endX-sx;
	var dy = this._endY-sy;
	var length = Math.max(Math.abs(dx), Math.abs(dy));
	
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;
	
	for (var i=0; i<length; i++) {
		var x = sx + i*dx;
		var y = sy + i*dy;
		if (!canBeDugCallback(     x,      y)) { return false; }
		if (!canBeDugCallback(x + nx, y + ny)) { return false; }
		if (!canBeDugCallback(x - nx, y - ny)) { return false; }
	}
	
	/**
	 * We do not want the corridor to crash into a corner of a room;
	 * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
	 * 
	 * Situation:
	 * #######1
	 * .......?
	 * #######2
	 * 
	 * The corridor was dug from left to rifht.
	 * 1, 2 - problematic corners, ? = N+1th cell (not dug)
	 */
	var firstCornerBad = !canBeDugCallback(x + dx + nx, y + dy + ny);
	var secondCornerBad = !canBeDugCallback(x + dx - nx, y + dy - ny);
	if (firstCornerBad || secondCornerBad) {
		if (canBeDugCallback(x + dx, y + dy)) { return false; }
	}

	return true;
}

ROT.Map.Feature.Corridor.prototype.dig = function(digCallback, wallCallback){ 
	var sx = this._startX;
	var sy = this._startY;
	var dx = this._endX-sx;
	var dy = this._endY-sy;
	var length = Math.max(Math.abs(dx), Math.abs(dy));
	
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;
	
	for (var i=0; i<length; i++) {
		var x = sx + i*dx;
		var y = sy + i*dy;
		if (digCallback) { digCallback(x, y); }
		
		if (i && wallCallback) {
			wallCallback(x + nx, y + ny);
			wallCallback(x - nx, y - ny);
		}
	}
	
	/* end of the wall */
	if (wallCallback) { wallCallback(x + dx, y + dy); }

	return true;
}
