/**
 * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
 * @param {object} [options]
 * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a simplified radiosity algorithm.
 */
ROT.Lighting = function(reflectivityCallback, options) {
	this._reflectivityCallback = reflectivityCallback;
	this._options = {
		passes: 1
	};
	for (var p in options) {
		this._options[p] = options[p];
	}
	this._fov = null;

}

/**
 * Set the used Field-Of-View algo
 * @param {ROT.FOV} fov
 */
ROT.Lighting.prototype.setFOV = function(fov) {
	this._fov = fov;
	return this;
}

/**
 * Define a new light source
 * @param {int} x
 * @param {int} y
 * @param {int[3]} color
 * @param {int} range
 */
ROT.Lighting.prototype.addLight = function(x, y, color, range) {
	return this;
}

/**
 * Remove an existing light source
 * @param {int} x
 * @param {int} y
 */
ROT.Lighting.prototype.removeLight = function(x, y) {
	return this;
}

/**
 * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
 */
ROT.Lighting.prototype.reset = function() {
	return this;
	
}

/**
 * Compute the lighting
 * @param {function} lightingCallback Will be called with (x, y, color, intensity) for every lit cell and light source lighting that cell
 */
ROT.Lighting.prototype.compute = function(lightingCallback) {
	return this;
}
