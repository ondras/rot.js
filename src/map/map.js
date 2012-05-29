ROT.Map = function(width, height) {
	this._width = width || ROT.DEFAULT_WIDTH;
	this._height = height || ROT.DEFAULT_HEIGHT;
};

ROT.Map.prototype.create = function(callback) {}

ROT.Map.prototype._fillMap = function(width, height, value) {
	var map = [];
	for (var i=0;i<width;i++) {
		map.push([]);
		for (var j=0;j<height;j++) { map[i].push(value); }
	}
	return map;
}
