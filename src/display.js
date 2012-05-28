/**
 * @class Visual map display
 * @see ROT.Display#setOptions
 */
ROT.Display = function(options) {
	this._canvas = document.createElement("canvas");
	this._context = this._canvas.getContext("2d");
	this._data = {};
	this._charWidth = 0;
	this._options = {};
	
	var defaultOptions = {
		width: ROT.DEFAULT_WIDTH,
		height: ROT.DEFAULT_HEIGHT,
		fontSize: 15,
		fontFamily: "monospace",
		fg: "#ccc",
		bg: "#000"
	};
	for (var p in options) { defaultOptions[p] = options[p]; }
	this.setOptions(defaultOptions);
	
	this.DEBUG = this.DEBUG.bind(this);
}

ROT.Display.prototype.DEBUG = function(x, y, what) {
	var colors = [this._options.bg, this._options.fg];
	this.draw(x, y, null, null, colors[what % colors.length]);
}

/**
 * Clear the whole display (cover it with background color)
 */
ROT.Display.prototype.clear = function() {
	this._data = {};
	this._context.fillStyle = this._options.bg;
	this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
}

/**
 * @param {object} [options]
 * @param {int} [options.width=ROT.DEFAULT_WIDTH]
 * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
 * @param {int} [options.fontSize=15]
 * @param {string} [options.fontFamily="monospace"]
 * @param {string} [options.fg="#ccc"]
 * @param {string} [options.bg="#000"]
 */
ROT.Display.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options.width || options.height || options.fontSize || options.fontFamily) { this._redraw(); }
	return this;
}

ROT.Display.prototype.getOptions = function() {
	return this._options;
}

ROT.Display.prototype.getContainer = function() {
	return this._canvas;
}

/**
 * @param {int} x
 * @param {int} y
 * @param {string} char 
 */
ROT.Display.prototype.draw = function(x, y, char, fg, bg) {
	var left = x*this._charWidth;
	var top = y*this._options.fontSize;
	/*
	if (y % 2) { x += 0.5; }
	left = x * this._options.fontSize;
	top = y * this._options.fontSize * Math.SQRT1_2;
	
	var coef = 0.8;
	x *= coef;
	y *= coef;
	*/
	if (!fg) { fg = this._options.fg; }
	if (!bg) { bg = this._options.bg; }
	
	var id = x+","+y;
	this._data[id] = [char, fg, bg];

	this._context.fillStyle = bg;
	this._context.fillRect(left, top, this._charWidth, this._options.fontSize);
	
	if (!char) { return; }
	
	this._context.fillStyle = fg;
	this._context.fillText(char.charAt(0), left, top);
}

/**
 * Draws a text at given position. Optionally wraps at a maximum length.
 */
ROT.Display.prototype.drawText = function(x, y, text, maxWidth) {
	var cx = x;
	var cy = y;

	for (var i=0;i<text.length;i++) {
		if (i && maxWidth && (i%maxWidth == 0)) {
			cx = x;
			cy++;
		}
		var ch = text.charAt(i);
		this.draw(cx++, cy, ch);
	}
}

ROT.Display.prototype._redraw = function() {
	/* compute char width */
	var font = this._options.fontSize + "px " + this._options.fontFamily;
	this._context.font = font;
	this._charWidth = Math.ceil(this._context.measureText("W").width);
	
	/* adjust size */
	this._canvas.width = this._options.width * this._charWidth;
	this._canvas.height = this._options.height * this._options.fontSize;
	this._context.font = font;
	this._context.textAlign = "left";
	this._context.textBaseline = "top";
	
	var data = this._data;
	this.clear();
	
	/* redraw cached data */
	for (var id in data) {
		var item = data[id];
		var parts = id.split(",");
		this.draw(parseInt(parts[0]), parseInt(parts[1]), item[0], item[1], item[2]);
	}
}
