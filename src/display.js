/**
 * @class Visual map display
 * @param {object} [options]
 * @param {int} [options.width=ROT.DEFAULT_WIDTH]
 * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
 * @param {int} [options.fontSize=15]
 * @param {string} [options.fontFamily="monospace"]
 * @param {string} [options.fontStyle=""] bold/italic/none/both
 * @param {string} [options.fg="#ccc"]
 * @param {string} [options.bg="#000"]
 * @param {int} [options.fps=25]
 * @param {float} [options.spacing=1]
 * @param {string} [options.layout="rect"]
 */
ROT.Display = function(options) {
	this._canvas = document.createElement("canvas");
	this._context = this._canvas.getContext("2d");
	this._dirty = false;
	this._layers = [];
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
		fps: 25,
		spacing: 1,
		fontFamily: "monospace",
		fontStyle: "",
		fg: "#ccc",
		bg: "#000"
	};
	for (var p in options) { defaultOptions[p] = options[p]; }
	this.setOptions(defaultOptions);
	this.DEBUG = this.DEBUG.bind(this);
	
	this._background = this.newLayer();
	this._interval = setInterval(this._tick.bind(this), 1000/this._options.fps);
}

/**
 * Debug helper, ideal as a map generator callback. Always bound to this.
 * @param {int} x
 * @param {int} y
 * @param {int} what
 */
ROT.Display.prototype.DEBUG = function(x, y, what) {
	var colors = [this._options.bg, this._options.fg];
	this.draw(x, y, null, null, colors[what % colors.length]);
}

/**
 * Clear the whole display (cover it with background color).  This applies to the background layer.
 */
ROT.Display.prototype.clear = function() {
	this._background.clear();
}

/**
 * Clear a specified region of the display. This applies to the background layer.
 * 
 * @param {int} x
 * @param {int} y
 * @param {int} w
 * @param {int} h
 */
ROT.Display.prototype.clearRect = function(x, y, w, h) {
	this._background.clearRect(x, y, w, h);
}

/**
 * @see ROT.Display
 */
ROT.Display.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing) { 
		this._compute();
		this._dirty = true;
	}
	return this;
}

/**
 * Returns currently set options
 * @returns {object} Current options object 
 */
ROT.Display.prototype.getOptions = function() {
	return this._options;
}

/**
 * Returns the DOM node of this display
 * @returns {node} DOM node
 */
ROT.Display.prototype.getContainer = function() {
	return this._canvas;
}

/**
 * This applies to the background layer.
 * @param {int} x
 * @param {int} y
 * @param {string} ch 
 * @param {string} [fg] foreground color
 * @param {string} [bg] background color
 */
ROT.Display.prototype.draw = function(x, y, ch, fg, bg) {
	this._background.draw(x, y, ch, fg, bg);
}

/**
 * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout. This applies to the background layer.
 * @param {int} x
 * @param {int} y
 * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
 * @param {int} [maxWidth] wrap at what width?
 * @returns {int} lines drawn
 */
ROT.Display.prototype.drawText = function(x, y, text, maxWidth) {
	this._background.drawText(x, y, text, maxWidth);
}

/**
 * Computes a width and height of a wrapped block of text.
 * @param {string} text
 * @param {int} [maxWidth] wrap at what width?
 * @returns {object} with "width" and "height"
 */
ROT.Display.prototype.measureText = function(text, maxWidth) {
	return ROT.Text.measure(text, maxWidth);
}

/**
 * Timer tick: update dirty parts
 */
ROT.Display.prototype._tick = function() {

	if (this._dirty === true) {
		this._context.fillStyle = this._options.bg;
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
	}
	
	for (var i=0; i < this._layers.length; i++) { 
		var layer = this._layers[i];
		if (this._dirty === true || layer._dirty === true) {
			// re-paint the whole layer
						
			for (var id in layer._data) { /* redraw cached data */
				this._draw(layer._data[id], true);
			}
		}
		else if (layer._dirty) {
			// incremental update
			for (var key in layer._dirty) {
				var dirtyState = layer._dirty[key];
				var x = dirtyState[0];
				var y = dirtyState[1];
				
				switch (this._options.layout) {
					case "rect":
						var cx = (x+0.5) * this._spacingX;
						var cy = (y+0.5) * this._spacingY;
						
						this._context.fillStyle = this._options.bg;
						this._context.fillRect(cx-this._spacingX/2, cy-this._spacingY/2, this._spacingX, this._spacingY);
					break;
					case "hex":
						var cx = (x+1) * this._spacingX;
						var cy = y * this._spacingY + this._hexSize;
						this._context.fillStyle = this._option.bg;
						this._fillHex(cx, cy);
					break;
				}
			}
			layer._dirty = false;
		}
	}

	this._dirty = false;
}

/**
 * @param {string} key What to draw
 * @param {bool} clearBefore Is it necessary to clean before?
 */
ROT.Display.prototype._draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	switch (this._options.layout) {
		case "rect":
			var cx = (x+0.5) * this._spacingX;
			var cy = (y+0.5) * this._spacingY;
			
			if (clearBefore || bg != this._options.bg) {
				this._context.fillStyle = bg;
				this._context.fillRect(cx-this._spacingX/2, cy-this._spacingY/2, this._spacingX, this._spacingY);
			}
		break;
		case "hex":
			var cx = (x+1) * this._spacingX;
			var cy = y * this._spacingY + this._hexSize;
			if (clearBefore || bg != this._options.bg) {
				this._context.fillStyle = bg;
				this._fillHex(cx, cy);
			}
		break;
	}

	if (!ch) { return; }
	
	this._context.fillStyle = fg;
	this._context.fillText(ch, cx, cy);
}

ROT.Display.prototype._fillHex = function(cx, cy) {
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

/**
 * Re-compute internal sizing variables, based on current options
 */
ROT.Display.prototype._compute = function() {
	/* compute char width */
	var font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily;
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
			this._spacingX = this._hexSize * Math.sqrt(3) / 2;
			this._spacingY = this._hexSize * 1.5;
			this._canvas.width = Math.ceil( (this._options.width + 1) * this._spacingX );
			this._canvas.height = Math.ceil( (this._options.height - 1) * this._spacingY + 2*this._hexSize );
		break;
	}
	
	this._context.font = font;
	this._context.textAlign = "center";
	this._context.textBaseline = "middle";
}

/**
 * @class Layer which may be drawn to.
 */
ROT.Layer = function(display) {
	this._data = {};
	this._dirty = false; /* false = nothing, true = all, object = dirty cells */
	this._display = display;
}

/**
 * Clear the whole layer (cover it with background color)
 */
ROT.Layer.prototype.clear = function() {
	this._data = {};
	this._dirty = true;
}

/**
 * Clear a specified region of the layer.
 * 
 * @param {int} x
 * @param {int} y
 * @param {int} w
 * @param {int} h
 */
ROT.Layer.prototype.clearRect = function(x, y, w, h) {
	for (var dx=x; dx <= (x + w); dx++) {
		for (var dy=y; dy <= (y + h); dy++) {
			delete this._data[dx+","+dy];
			if (!this._dirty) { this._dirty = {}; } /* first! */
			this._dirty[dx+","+dy] = [dx, dy];
		}
	}
}

/**
 * @param {int} x
 * @param {int} y
 * @param {string} ch 
 * @param {string} [fg] foreground color
 * @param {string} [bg] background color
 */
ROT.Layer.prototype.draw = function(x, y, ch, fg, bg) {
	if (!fg) { fg = this._display._options.fg; }
	if (!bg) { bg = this._display._options.bg; }
	this._data[x+","+y] = [x, y, ch, fg, bg];
	
	if (this._dirty === true) { return; } /* will already redraw everything */
	if (!this._dirty) { this._dirty = {}; } /* first! */
	this._dirty[x+","+y] = true;
}

/**
 * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
 * @param {int} x
 * @param {int} y
 * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
 * @param {int} [maxWidth] wrap at what width?
 * @returns {int} lines drawn
 */
ROT.Layer.prototype.drawText = function(x, y, text, maxWidth) {
	var fg = null;
	var bg = null;
	var cx = x;
	var cy = y;
	var lines = 1;

	var tokens = ROT.Text.tokenize(text, maxWidth);

	while (tokens.length) { /* interpret tokenized opcode stream */
		var token = tokens.shift();
		switch (token.type) {
			case ROT.Text.TYPE_TEXT:
				for (var i=0;i<token.value.length;i++) {
					this.draw(cx++, cy, token.value.charAt(i), fg, bg);
				}
			break;

			case ROT.Text.TYPE_FG:
				fg = token.value || null;
			break;

			case ROT.Text.TYPE_BG:
				bg = token.value || null;
			break;

			case ROT.Text.TYPE_NEWLINE:
				cx = x;
				cy++;
				lines++
			break;

		}
	}

	return lines;
}

/**
 * Delete this layer.
 */
ROT.Layer.prototype.remove = function() {
	var index = display._layers.indexOf(item);
	display._layers.splice(index, 1);
}

/**
 * Create a new layer.
 * @returns {ROT.Layer} layer object
 */
ROT.Display.prototype.newLayer = function() {
	var layer = new ROT.Layer(this);
	this._layers.push(layer);
	return layer;
}
