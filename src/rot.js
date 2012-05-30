/**
 * @namespace
 */
var ROT = {
	DEFAULT_WIDTH: 80,
	DEFAULT_HEIGHT: 25,
	/**
	 * @returns {bool} Is rot.js supported by this browser?
	 */
	isSupported: function() {
		return !!(document.createElement("canvas").getContext && Function.prototype.bind);
	}
};
