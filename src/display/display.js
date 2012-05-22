/**
 * @class Visual map display
 * @see ROT.Display#configure
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

ROT.Display.prototype.DEBUG = function(x, y, wall) {
	this.draw(x, y, wall ? "█" : ".");
}

ROT.Display.prototype.clear = function() {
	this._data = {};
	this._context.fillStyle = this._options.bg;
	this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
}

/**
 */
ROT.Display.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options.width || options.height || options.fontSize || options.fontFamily) { this._redraw(); }
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
	
	if (!fg) { fg = this._options.fg; }
	if (!bg) { bg = this._options.bg; }
	
	this._context.fillStyle = bg;
	this._context.fillRect(left, top, this._charWidth, this._options.fontSize);
	
	this._context.fillStyle = fg;
	this._context.fillText(char.charAt(0), left, top);
	
	var id = x+","+y;
	this._data[id] = [char, fg, bg];
}

ROT.Display.prototype._redraw = function() {
	/* compute char width */
	var font = this._options.fontSize + "px " + this._options.fontFamily;
	this._context.font = font;
	this._charWidth = this._context.measureText("W").width;
	
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
