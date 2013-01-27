/**
 * @class Rectangular backend
 * @private
 */
ROT.Display.Rect = function(context) {
	ROT.Display.Backend.call(this, context);
	
	this._spacingX = 0;
	this._spacingY = 0;
}
ROT.Display.Rect.extend(ROT.Display.Backend);

ROT.Display.Rect.prototype.compute = function(options) {
	var charWidth = Math.ceil(this._context.measureText("W").width);
	this._spacingX = Math.ceil(options.spacing * charWidth);
	this._spacingY = Math.ceil(options.spacing * options.fontSize);
	this._context.canvas.width = options.width * this._spacingX;
	this._context.canvas.height = options.height * this._spacingY;
}

ROT.Display.Rect.prototype.clear = function(x, y) {
	var cx = (x+0.5) * this._spacingX;
	var cy = (y+0.5) * this._spacingY;
	this._context.fillRect(cx-this._spacingX/2, cy-this._spacingY/2, this._spacingX, this._spacingY);
}

ROT.Display.Rect.prototype.draw = function(x, y, ch) {
	var cx = (x+0.5) * this._spacingX;
	var cy = (y+0.5) * this._spacingY;
	this._context.fillText(ch, cx, cy);
}
