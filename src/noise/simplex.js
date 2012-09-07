/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */

/**
 * @class 2D simplex noise generator
 * @param {int} [gridSize=16] Grid size
 */
ROT.Noise.Simplex = function(gridSize) {
	ROT.Noise.call(this);

	this._F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    this._G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
	this._gridSize = gridSize || 16;

	this._gradients = [
		[ 0, -1],
		[ 1, -1],
		[ 1,  0],
		[ 1,  1],
		[ 0,  1],
		[-1,  1],
		[-1,  0],
		[-1, -1]
	];

	this._grid = [];
	for (var i=0;i<this._gridSize;i++) {
		this._grid.push([]);
		for (var j=0;j<this._gridSize;j++) {
			var index = ~~(ROT.RNG.getUniform()*this._gradients.length);
			this._grid[i].push(index);
		}
	}
};
ROT.Noise.Simplex.extend(ROT.Noise);

ROT.Noise.Simplex.prototype.get = function(xin, yin) {
	xin *= this._gridSize;
	yin *= this._gridSize;

	var n0 =0, n1 = 0, n2 = 0; // Noise contributions from the three corners
	// Skew the input space to determine which simplex cell we're in
	var s = (xin + yin) * this._F2; // Hairy factor for 2D
	var i = Math.floor(xin + s);
	var j = Math.floor(yin + s);
	var t = (i + j) * this._G2;
	var X0 = i - t; // Unskew the cell origin back to (x,y) space
	var Y0 = j - t;
	var x0 = xin - X0; // The x,y distances from the cell origin
	var y0 = yin - Y0;
	// For the 2D case, the simplex shape is an equilateral triangle.
	// Determine which simplex we are in.
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	if (x0 > y0) {
		i1 = 1;
		j1 = 0;
	} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	else {
		i1 = 0;
		j1 = 1;
	} // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	// c = (3-sqrt(3))/6
	var x1 = x0 - i1 + this._G2; // Offsets for middle corner in (x,y) unskewed coords
	var y1 = y0 - j1 + this._G2;
	var x2 = x0 - 1.0 + 2.0 * this._G2; // Offsets for last corner in (x,y) unskewed coords
	var y2 = y0 - 1.0 + 2.0 * this._G2;
	// Work out the hashed gradient indices of the three simplex corners


	// Calculate the contribution from the three corners
	var t0 = 0.5 - x0 * x0 - y0 * y0;
	if (t0 >= 0) {
		t0 *= t0;

		var index = this._grid[i % this._gridSize][j % this._gridSize];
		var grad = this._gradients[index];
		n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
	}
	var t1 = 0.5 - x1 * x1 - y1 * y1;
	if (t1 >= 0) {
		t1 *= t1;

		var index = this._grid[(i+i1) % this._gridSize][(j+j1) % this._gridSize];
		var grad = this._gradients[index];
		n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
	}
	var t2 = 0.5 - x2 * x2 - y2 * y2;
	if (t2 >= 0) {
		t2 *= t2;

		var index = this._grid[(i+1) % this._gridSize][(j+1) % this._gridSize];
		var grad = this._gradients[index];

		n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
	}
	// Add contributions from each corner to get the final noise value.
	// The result is scaled to return values in the interval [-1,1].
	return 70.0 * (n0 + n1 + n2);
}
