/**
 * @class Hexagonal backend
 * @private
 */
ROT.Display.Hex = function(context) {
	ROT.Display.Backend.call(this, context);

	this._spacingX = 0;
	this._spacingY = 0;
	this._hexSize = 0;
}
ROT.Display.Hex.extend(ROT.Display.Backend);

ROT.Display.Hex.prototype.compute = function(options) {
	var charWidth = Math.ceil(this._context.measureText("W").width);
	this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth/Math.sqrt(3)) / 2);
	this._spacingX = this._hexSize * Math.sqrt(3) / 2;
	this._spacingY = this._hexSize * 1.5;
	this._context.canvas.width = Math.ceil( (options.width + 1) * this._spacingX );
	this._context.canvas.height = Math.ceil( (options.height - 1) * this._spacingY + 2*this._hexSize );
}

ROT.Display.Hex.prototype.clear = function(x, y) {
	var cx = (x+1) * this._spacingX;
	var cy = y * this._spacingY + this._hexSize;
	this._fill(cx, cy);
}

ROT.Display.Hex.prototype.draw = function(x, y, ch) {
	var cx = (x+1) * this._spacingX;
	var cy = y * this._spacingY + this._hexSize;
	this._context.fillText(ch, cx, cy);
}


ROT.Display.Hex.prototype.computeSize = function(availWidth, availHeight, options) {
	/* FIXME */
}

ROT.Display.Hex.prototype.computeFontSize = function(availWidth, availHeight, options) {
	/* FIXME */
}

ROT.Display.Hex.prototype._fill = function(cx, cy) {
	var a = this._hexSize;
	
	this._context.beginPath();
	this._context.moveTo(cx, cy-a);
	this._context.lineTo(cx + this._spacingX, cy-a/2);
	this._context.lineTo(cx + this._spacingX, cy+a/2);
	this._context.lineTo(cx, cy+a);
	this._context.lineTo(cx - this._spacingX, cy+a/2);
	this._context.lineTo(cx - this._spacingX, cy-a/2);
	this._context.lineTo(cx, cy-a);
	this._context.fill();
}
