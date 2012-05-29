/**
 * @class Visual map display
 * @param {object} [options]
 * @param {int} [options.width=ROT.DEFAULT_WIDTH]
 * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
 * @param {int} [options.fontSize=15]
 * @param {string} [options.fontFamily="monospace"]
 * @param {string} [options.fg="#ccc"]
 * @param {string} [options.bg="#000"]
 * @param {float} [options.spacing=1]
 * @param {string} [options.layout="rect"]
 */
ROT.Display = function(options) {
	this._canvas = document.createElement("canvas");
	this._context = this._canvas.getContext("2d");
	this._data = {};
	this._charWidth = 0;
	this._hexSize = 0;
	this._hexSpacingX = 0;
	this._hexSpacingY = 0;
	this._options = {};
	
	var defaultOptions = {
		width: ROT.DEFAULT_WIDTH,
		height: ROT.DEFAULT_HEIGHT,
		layout: "rect",
		fontSize: 15,
		spacing: 1,
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
 * @see ROT.Display
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
	if (!fg) { fg = this._options.fg; }
	if (!bg) { bg = this._options.bg; }
	
	var id = x+","+y;
	this._data[id] = [char, fg, bg];
	
	this._context.fillStyle = bg;

	switch (this._options.layout) {
		case "rect":
			var cx = (x+0.5) * this._spacingX;
			var cy = (y+0.5) * this._spacingY;
			
			this._context.fillRect(cx-this._spacingX/2, cy-this._spacingY/2, this._spacingX, this._spacingY);
		break;
		case "hex":
			var a = this._hexSize;
			if (y % 2) { x += 0.5; }
			var cx = (x+0.5) * this._spacingX;
			var cy = y * this._spacingY + a;
			
			this._context.beginPath();
			this._context.moveTo(cx, cy-a);
			this._context.lineTo(cx + this._spacingX/2, cy-a/2);
			this._context.lineTo(cx + this._spacingX/2, cy+a/2);
			this._context.lineTo(cx, cy+a);
			this._context.lineTo(cx - this._spacingX/2, cy+a/2);
			this._context.lineTo(cx - this._spacingX/2, cy-a/2);
			this._context.lineTo(cx, cy-a);
			this._context.fill();
		break;
	}

	
	if (!char) { return; }
	
	this._context.fillStyle = fg;
	this._context.fillText(char.charAt(0), cx, cy);
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
	
	switch (this._options.layout) {
		case "rect":
			this._spacingX = Math.ceil(this._options.spacing * this._charWidth);
			this._spacingY = Math.ceil(this._options.spacing * this._options.fontSize);
			this._canvas.width = this._options.width * this._spacingX;
			this._canvas.height = this._options.height * this._spacingY;
		break;
		case "hex":
			this._hexSize = Math.floor(this._options.spacing * (this._options.fontSize + this._charWidth/Math.sqrt(3)) / 2);
			this._spacingX = this._hexSize * Math.sqrt(3);
			this._spacingY = this._hexSize * 1.5;
			this._canvas.width = Math.ceil( (this._options.width + 0.5) * this._spacingX );
			this._canvas.height = Math.ceil( (this._options.height - 1) * this._spacingY + 2*this._hexSize );
		break;
	}
	
	this._context.font = font;
	this._context.textAlign = "center";
	this._context.textBaseline = "middle";
	
	var data = this._data;
	this.clear();
	
	/* redraw cached data */
	for (var id in data) {
		var item = data[id];
		var parts = id.split(",");
		this.draw(parseInt(parts[0]), parseInt(parts[1]), item[0], item[1], item[2]);
	}
}
