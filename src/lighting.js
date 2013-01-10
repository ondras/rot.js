/**
 * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
 * @param {object} [options]
 * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a simplified radiosity algorithm.
 * @param {int} [options.emissionThreshold=0.2] Cells with emissivity > threshold will be treated in light source in the next pass.
 */
ROT.Lighting = function(reflectivityCallback, options) {
	this._reflectivityCallback = reflectivityCallback;
	this._options = {
		passes: 1,
		emissionThreshold: 0.2
	};
	for (var p in options) {
		this._options[p] = options[p];
	}
	this._fov = null;

	this._range = 10; /* FIXME */
	this._lights = {};
	this._reflectivityCache = {};
	this._fovCache = {};
}

/**
 * Set the used Field-Of-View algo
 * @param {ROT.FOV} fov
 */
ROT.Lighting.prototype.setFOV = function(fov) {
	this._fov = fov;
	this._fovCache = {};
	return this;
}

/**
 * Define a new light source
 * @param {int} x
 * @param {int} y
 * @param {int[3]} color
 */
ROT.Lighting.prototype.addLight = function(x, y, color) {
	this._lights[x+","+y] = color;
	return this;
}

/**
 * Remove an existing light source
 * @param {int} x
 * @param {int} y
 */
ROT.Lighting.prototype.removeLight = function(x, y) {
	delete this._lights[x+","+y];
	return this;
}

/**
 * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
 */
ROT.Lighting.prototype.reset = function() {
	this._reflectivityCache = {};
	this._fovCache = {};

	return this;
}

/**
 * Compute the lighting
 * @param {function} lightingCallback Will be called with (x, y, color, intensity) for every lit cell and light source lighting that cell
 */
ROT.Lighting.prototype.compute = function(lightingCallback) {
	for (var key in this._lights) { /* compute all lights independently */

		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);

		var litCells = {};
		var emittingCells = {};
		emittingCells[key] = 1;

		for (var i=0;i<this._options.passes;i++) { /* emit as long as requested */
			this._emitLight(emittingCells, litCells);
		}

		for (var litKey in litCells) { /* let the user know what and how is lit */
			var parts = litKey.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			var intensity = litCells[litKey];
			/* FIXME intensity threshold */
			lightingCallback(x, y, this._lights[key], intensity);
		}

	}

	return this;
}

/**
 * Compute one iteration from all emitting cells
 */
ROT.Lighting.prototype._emitLight = function(emittingCells, litCells) {
	/* first, emit from all cells */
	for (var key in emittingCells) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this._emitLightFromCell(x, y, emittingCells[key], litCells);
		delete emittingCells[key];
	}

	/* second, mark "strong" lit cells as emitters for further iterations */
	for (var key in litCells) {
		if (!(key in this._reflectivityCache)) { 
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this._reflectivityCache[key] = this._reflectivityCallback(x, y);
		}
		var emissionIntensity = litCells[key] * this._reflectivityCache[key];
		if (emissionIntensity > this._options.emissionThreshold) { emittingCells[key] = emissionIntensity; }
	}
}

/**
 * Compute one iteration from one cell
 * @param {int} x
 * @param {int} y
 * @param {?} ?
 * @param {object} litCells Cell data to by updated
 */
ROT.Lighting.prototype._emitLightFromCell = function(x, y, intensity, litCells) {
	var key = x+","+y;
	if (!(key in this._fovCache)) { this._updateFOV(x, y); }
	var fov = this._fovCache[key];

	for (var fovKey in fov) {
		var formFactor = fov[fovKey];
		/* FIXME form factor threshold? */
		if (!(fovKey in litCells)) { litCells[fovKey] = 0; }
		litCells[fovKey] += intensity*formFactor;
	}
}

/**
 * Compute FOV ("form factor") for a potential light source at [x,y]
 * @param {int} x
 * @param {int} y
 */
ROT.Lighting.prototype._updateFOV = function(x, y) {
	var key1 = x+","+y;
	var cache = {};
	this._fovCache[key1] = cache;
	var cb = function(x, y, r) {
		var key2 = x+","+y;
		cache[key2] = 1/(r+1);
	}
	this._fov.compute(x, y, this._range, cb.bind(this));
	/* FIXME normalize to a constant vaue? */
}
