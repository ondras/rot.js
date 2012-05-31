ROT.Map.Feature = function() {
}

ROT.Map.Feature.prototype.isValid = function(canBeDugCallback) {
	return false;
}

ROT.Map.Feature.prototype.dig = function(digCallback, wallCallback) {
}

ROT.Map.Feature.prototype.getArea = function() {
	return 0;
}

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
	
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (!canBeDugCallback(x, y)) { return false; }
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
				digCallback(x, y);
			} else {
				wallCallback(x, y);
			}
		}
	}
}

ROT.Map.Feature.Room.prototype.getArea = function() {
	return (this._x2 - this._x1 + 1) * (this._y2 - this._y1 + 1);
}

ROT.Map.Feature.Room = function(x1, y1, x2, y2) {
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
	
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (!canBeDugCallback(x, y)) { return false; }
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
				digCallback(x, y);
			} else {
				wallCallback(x, y);
			}
		}
	}
}

ROT.Map.Feature.Room.prototype.getArea = function() {
	return (this._x2 - this._x1 + 1) * (this._y2 - this._y1 + 1);
}
