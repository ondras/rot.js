/**
 * @class Abstract FOV algorithm
 * @param {function} lightPassesCallback Does the light pass through x,y?
 */
ROT.FOV = function(lightPassesCallback) {
	this._lightPasses = lightPassesCallback;
};

ROT.FOV.prototype.compute = function(x, y, R, callback) {}
