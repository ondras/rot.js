/**
 * @class Abstract display backend module
 * @private
 */
ROT.Display.Backend = function(context) {
	this._context = context;
}

ROT.Display.Backend.prototype.compute = function(options) {
}

ROT.Display.Backend.prototype.clear = function(x, y) {
}

ROT.Display.Backend.prototype.draw = function(x, y, ch) {
}

ROT.Display.Backend.prototype.computeSize = function(availWidth, availHeight, options) {
}

ROT.Display.Backend.prototype.computeFontSize = function(availWidth, availHeight, options) {
}
