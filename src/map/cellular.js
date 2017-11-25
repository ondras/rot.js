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
	this.setOptions(options);

	this._dirs = ROT.DIRS[this._options.topology];
	this._map = this._fillMap(0);
};
ROT.Map.Cellular.extend(ROT.Map);

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
	return this;
};

/**
 * Change options.
 * @see ROT.Map.Cellular
 */
ROT.Map.Cellular.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
};

ROT.Map.Cellular.prototype.set = function(x, y, value) {
	this._map[x][y] = value;
};

ROT.Map.Cellular.prototype.create = function(callback) {
	var newMap = this._fillMap(0);
	var born = this._options.born;
	var survive = this._options.survive;


	for (var j=0;j<this._height;j++) {
		var widthStep = 1;
		var widthStart = 0;
		if (this._options.topology == 6) {
			widthStep = 2;
			widthStart = j%2;
		}

		for (var i=widthStart; i<this._width; i+=widthStep) {
			var cur = this._map[i][j];
			var ncount = this._getNeighbors(i, j);

			if (cur && survive.indexOf(ncount) != -1) { /* survive */
				newMap[i][j] = 1;
			} else if (!cur && born.indexOf(ncount) != -1) { /* born */
				newMap[i][j] = 1;
			}
		}
	}

	this._map = newMap;
	callback && this._serviceCallback(callback);
};

ROT.Map.Cellular.prototype._serviceCallback = function(callback) {
	for (var j=0;j<this._height;j++) {
		var widthStep = 1;
		var widthStart = 0;
		if (this._options.topology == 6) {
			widthStep = 2;
			widthStart = j%2;
		}
		for (var i=widthStart; i<this._width; i+=widthStep) {
			callback(i, j, this._map[i][j]);
		}
	}
};

/**
 * Get neighbor count at [i,j] in this._map
 */
ROT.Map.Cellular.prototype._getNeighbors = function(cx, cy) {
	var result = 0;
	for (var i=0;i<this._dirs.length;i++) {
		var dir = this._dirs[i];
		var x = cx + dir[0];
		var y = cy + dir[1];

		if (x < 0 || x >= this._width || y < 0 || y >= this._height) { continue; }
		result += (this._map[x][y] == 1 ? 1 : 0);
	}

	return result;
};

/**
 * Make sure every non-wall space is accessible.
 * @param {function} callback to call to display map when do
 * @param {int} value to consider empty space - defaults to 0
 * @param {function} callback to call when a new connection is made
 */
ROT.Map.Cellular.prototype.connect = function(callback, value, connectionCallback) {
	if (!value) value = 0;

	var allFreeSpace = [];
	var notConnected = {};

	// find all free space
	var widthStep = 1;
	var widthStarts = [0, 0];
	if (this._options.topology == 6) {
		widthStep = 2;
		widthStarts = [0, 1];
	}
	for (var y = 0; y < this._height; y++) {
		for (var x = widthStarts[y % 2]; x < this._width; x += widthStep) {
			if (this._freeSpace(x, y, value)) {
				var p = [x, y];
				notConnected[this._pointKey(p)] = p;
				allFreeSpace.push([x, y]);
			}
		}
	}
	var start = allFreeSpace[ROT.RNG.getUniformInt(0, allFreeSpace.length - 1)];

	var key = this._pointKey(start);
	var connected = {};
	connected[key] = start;
	delete notConnected[key];

	// find what's connected to the starting point
	this._findConnected(connected, notConnected, [start], false, value);

	while (Object.keys(notConnected).length > 0) {
		// find two points from notConnected to connected
		var p = this._getFromTo(connected, notConnected);
		var from = p[0]; // notConnected
		var to = p[1]; // connected

		// find everything connected to the starting point
		var local = {};
		local[this._pointKey(from)] = from;
		this._findConnected(local, notConnected, [from], true, value);

		// connect to a connected cell
		var tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
		tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);

		// now all of local is connected
		for (var k in local) {
			var pp = local[k];
			this._map[pp[0]][pp[1]] = value;
			connected[k] = pp;
			delete notConnected[k];
		}
	}

	callback && this._serviceCallback(callback);
};

/**
 * Find random points to connect. Search for the closest point in the larger space.
 * This is to minimize the length of the passage while maintaining good performance.
 */
ROT.Map.Cellular.prototype._getFromTo = function(connected, notConnected) {
	var from, to, d;
	var connectedKeys = Object.keys(connected);
	var notConnectedKeys = Object.keys(notConnected);
	for (var i = 0; i < 5; i++) {
		if (connectedKeys.length < notConnectedKeys.length) {
			var keys = connectedKeys;
			to = connected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]];
			from = this._getClosest(to, notConnected);
		} else {
			var keys = notConnectedKeys;
			from = notConnected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]];
			to = this._getClosest(from, connected);
		}
		d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
		if (d < 64) {
			break;
		}
	}
	// console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
	return [from, to];
};

ROT.Map.Cellular.prototype._getClosest = function(point, space) {
	var minPoint = null;
	var minDist = null;
	for (k in space) {
		var p = space[k];
		var d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
		if (minDist == null || d < minDist) {
			minDist = d;
			minPoint = p;
		}
	}
	return minPoint;
};

ROT.Map.Cellular.prototype._findConnected = function(connected, notConnected, stack, keepNotConnected, value) {
	while(stack.length > 0) {
		var p = stack.splice(0, 1)[0];
		var tests;

		if (this._options.topology == 6) {
			tests = [
				[p[0] + 2, p[1]],
				[p[0] + 1, p[1] - 1],
				[p[0] - 1, p[1] - 1],
				[p[0] - 2, p[1]],
				[p[0] - 1, p[1] + 1],
				[p[0] + 1, p[1] + 1],
			];
		} else {
			tests = [
				[p[0] + 1, p[1]],
				[p[0] - 1, p[1]],
				[p[0],     p[1] + 1],
				[p[0],     p[1] - 1]
			];
		}

		for (var i = 0; i < tests.length; i++) {
			var key = this._pointKey(tests[i]);
			if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
				connected[key] = tests[i];
				if (!keepNotConnected) {
					delete notConnected[key];
				}
				stack.push(tests[i]);
			}
		}
	}
};

ROT.Map.Cellular.prototype._tunnelToConnected = function(to, from, connected, notConnected, value, connectionCallback) {
	var key = this._pointKey(from);
	var a, b;
	if (from[0] < to[0]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}
	for (var xx = a[0]; xx <= b[0]; xx++) {
		this._map[xx][a[1]] = value;
		var p = [xx, a[1]];
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}
	if (connectionCallback && a[0] < b[0]) {
		connectionCallback(a, [b[0], a[1]]);
	}

	// x is now fixed
	var x = b[0];

	if (from[1] < to[1]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}
	for (var yy = a[1]; yy < b[1]; yy++) {
		this._map[x][yy] = value;
		var p = [x, yy];
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}
	if (connectionCallback && a[1] < b[1]) { connectionCallback([b[0], a[1]], [b[0], b[1]]); }
}

ROT.Map.Cellular.prototype._tunnelToConnected6 = function(to, from, connected, notConnected, value, connectionCallback) {
	var a, b;
	if (from[0] < to[0]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}

	// tunnel diagonally until horizontally level
	var xx = a[0];
	var yy = a[1];
	while (!(xx == b[0] && yy == b[1])) {
		var stepWidth = 2;
		if (yy < b[1]) {
			yy++;
			stepWidth = 1;
		} else if (yy > b[1]) {
			yy--;
			stepWidth = 1;
		}
		if (xx < b[0]) {
			xx += stepWidth
		} else if (xx > b[0]) {
			xx -= stepWidth
		} else if (b[1] % 2) {
			// Won't step outside map if destination on is map's right edge
			xx -= stepWidth;
		} else {
			// ditto for left edge
			xx += stepWidth;
		}
		this._map[xx][yy] = value;
		var p = [xx, yy]
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}

	if (connectionCallback) { connectionCallback(from, to); }
}

ROT.Map.Cellular.prototype._freeSpace = function(x, y, value) {
	return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
}

ROT.Map.Cellular.prototype._pointKey = function(p) {
	return p[0] + "." + p[1];
}
