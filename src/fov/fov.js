/**
 * @class Abstract FOV algorithm
 * @param {function} lightPassesCallback Does the light pass through x,y?
 */
ROT.FOV = function(lightPassesCallback) {
	this._lightPasses = lightPassesCallback;
};

/**
 * Compute visibility
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.prototype.compute = function(x, y, R, callback) {}
