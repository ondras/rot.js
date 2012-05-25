/**
 * @namespace
 */
var ROT = {
	DEFAULT_WIDTH: 80,
	DEFAULT_HEIGHT: 25,
	isSupported: function() {
		return !!(document.createElement("canvas").getContext && Function.prototype.bind);
	}
};
