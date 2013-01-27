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
	this._context.fillRect(x*this._spacingX, y*this._spacingY, this._spacingX, this._spacingY);
}

ROT.Display.Rect.prototype.draw = function(x, y, ch) {
	var cx = (x+0.5) * this._spacingX;
	var cy = (y+0.5) * this._spacingY;
	this._context.fillText(ch, cx, cy);
}

ROT.Display.Rect.prototype.computeSize = function(availWidth, availHeight, options) {
	var width = Math.floor(availWidth / this._spacingX);
	var height = Math.floor(availHeight / this._spacingY);
	return [width, height]
}

ROT.Display.Rect.prototype.computeFontSize = function(availWidth, availHeight, options) {
	var boxWidth = Math.floor(availWidth / options.width);
	var boxHeight = Math.floor(availHeight / options.height);

	/* compute char ratio */
	var oldFont = this._context.font;
	this._context.font = "100px " + options.fontFamily;
	var width = Math.ceil(this._context.measureText("W").width);
	this._context.font = oldFont;
	var ratio = width / 100;
		
	var widthFraction = ratio * boxHeight / boxWidth;
	if (widthFraction > 1) { /* too wide with current aspect ratio */
		boxHeight = Math.floor(boxHeight / widthFraction);
	}
	return Math.floor(boxHeight / options.spacing);
}
