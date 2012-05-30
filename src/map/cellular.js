/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
ROT.Map.Cellular = function(width, height, options) {
	ROT.Map.call(this, width, height);
	this._options = {
		born: [5, 6, 7, 8],
		survive: [4, 5, 6, 7, 8],
		topology: 8
	};
	for (var p in options) { this._options[p] = options[p]; }
	
	this._diffs = this.constructor.DIFFS[this._options.topology];
	this._map = this._fillMap(0);
}
ROT.Map.Cellular.extend(ROT.Map);

ROT.Map.Cellular.DIFFS = {
	"4": [
		[-1,  0],
		[ 1, -1],
		[ 1,  0],
		[ 0, -1],
		[ 0,  1]
	],
	"8": [
		[-1, -1],
		[-1,  0],
		[-1,  1],
		[ 1, -1],
		[ 1,  0],
		[ 1,  1],
		[ 0, -1],
		[ 0,  1]
	],
	"6": [
		[-1,  0],
		[ 1,  0],
		
		/* odd rows add +1 to X */
		[-1, -1],
		[-1,  1],
		[ 0, -1],
		[ 0,  1]
	]
};


/**
 * Fill the map with random values
 * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
 */
ROT.Map.Cellular.prototype.randomize = function(probability) {
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			this._map[i][j] = (ROT.RNG.getUniform() < probability ? 1 : 0);
		}
	}
}

ROT.Map.Cellular.prototype.set = function(x, y, value) {
	this._map[x][y] = value;
}

ROT.Map.Cellular.prototype.create = function(callback) {
	var newMap = this._fillMap(0);
	var born = this._options.born;
	var survive = this._options.survive;
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			var cur = this._map[i][j];
			var ncount = this._getNeighbors(i, j);
			
			if (cur && survive.indexOf(ncount) != -1) { /* survive */
				newMap[i][j] = 1;
			} else if (!cur && born.indexOf(ncount) != -1) { /* born */
				newMap[i][j] = 1;
			}
			
			if (callback) { callback(i, j, newMap[i][j]); }
		}
	}
	
	this._map = newMap;
}

/**
 * Get neighbor count at [i,j] in this._map, using this._options.topology
 */
ROT.Map.Cellular.prototype._getNeighbors = function(cx, cy) {
	var result = 0;
	for (var i=0;i<this._diffs.length;i++) {
		var diff = this._diffs[i];
		var x = cx + diff[0];
		var y = cy + diff[1];
		
		/* odd rows are shifted */
		if (this._options.topology == 6 && (cy % 2) && diff[1]) {  x += 1; }
		
		if (x < 0 || x >= this._width || x < 0 || y >= this._width) { continue; }
		result += (this._map[x][y] == 1 ? 1 : 0);
	}
	
	return result;
}
