var ROT = {
	DEFAULT_WIDTH: 80,
	DEFAULT_HEIGHT: 25,
	isSupported: function() {
		return !!(document.createElement("canvas").getContext && Function.prototype.bind);
	}
};
ROT.RNG = {
	/**
	 * @returns {number} 
	 */
	getSeed: function() {
		return this._seed;
	},

	/**
	 * @param {number} seed Seed the number generator
	 */
	setSeed: function(seed) {
		seed = (seed < 1 ? 1/seed : seed);

		this._seed = seed;
		this._s0 = (seed >>> 0) * this._frac;
		seed = (seed * 1103515245) + 12345;
		this._s1 = (seed >>> 0) * this._frac;
		seed = (seed * 1103515245) + 12345;
		this._s2 = (seed >>> 0) * this._frac;
		this.c = 1;

		return this;
	},

	/**
	 * @returns {float} Pseudorandom value (0,1) exclusive, uniformly distributed
	 */
	getUniform: function() {
		var t = 2091639 * this._s0 + this._c * this._frac;
		this._s0 = this._s1;
		this._s1 = this._s2;
		this._c = t | 0;
		this._s2 = t - this._c;
		return this._s2;
	},

	/**
	 * @param {float} mean Mean value
	 * @param {float} stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
	 * @returns {float} A normally distributed pseudorandom value
	 */
	getNormal: function(mean, stddev) {
		do {
			var u = 2*this.getUniform()-1;
			var v = 2*this.getUniform()-1;
			var r = u*u + v*v;
		} while (r > 1 || r == 0);

		var gauss = u * Math.sqrt(-2*Math.log(r)/r);
		return mean + gauss*stddev;
	},

	/**
	 * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
	 */
	getPercentage: function() {
		return Math.ceil(this.getUniform()*100);
	},
	
	pushState: function() {
		this._state.push(this.getState());
		return this;
	},
	
	popState: function() {
		this.setState(this._state.pop());
		return this;
	},
	
	getState: function() {
		return [this._s0, this._s1, this._s2, this._c];
	},

	setState: function(state) {
		this._s0 = state[0];
		this._s1 = state[1];
		this._s2 = state[2];
		this._c  = state[3];
		return this;
	},

	_s0: 0,
	_s1: 0,
	_s2: 0,
	_c: 0,
	_frac: 2.3283064365386963e-10, // 2^-32
	_state: []
}

ROT.RNG.setSeed(Date.now());
Array.prototype.random = function() {
	if (!this.length) { return null; }
	return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.clone = function() {
	var arr = [];
	for (var i=0;i<this.length;i++) { arr.push(this[i]); }
	return arr;
}

Array.prototype.randomize = function() {
	var result = [];
	while (this.length) {
		var index = this.indexOf(this.random());
		result.push(this.splice(index, 1)[0]);
	}
	return result;
}
if (!Date.now) { Date.now = function() { return +(new Date); } }
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.substring(1);
}

String.prototype.format = function() {
	var args = Array.prototype.slice.call(arguments);
	var str = this;
	return str.replace(/%s/g, function(match, index) {
		if (str.charAt(index-1) == "%") {
			return match;
		} else {
			return args.shift();
		}
	});
}
if (!Object.create) {  
	Object.create = function(o) {  
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};  
}  
Function.prototype.extend = function(parent) {
	this.prototype = Object.create(parent.prototype);
	return this;
}
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
	this.draw(x, y, null, null, wall ? "#ddd" : "#888");
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
	
	var id = x+","+y;
	this._data[id] = [char, fg, bg];

	this._context.fillStyle = bg;
	this._context.fillRect(left, top, this._charWidth, this._options.fontSize);
	
	if (!char) { return; }
	
	this._context.fillStyle = fg;
	this._context.fillText(char.charAt(0), left, top);
	
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
ROT.Map = function(width, height) {
	this._width = width || ROT.DEFAULT_WIDTH;
	this._height = height || ROT.DEFAULT_HEIGHT;
};

ROT.Map.prototype.create = function(callback) {}
ROT.Map.Arena = function(width, height) {
	ROT.Map.call(this, width, height);
}
ROT.Map.Arena.extend(ROT.Map);

ROT.Map.Arena.prototype.create = function(callback) {
	var w = this._width-1;
	var h = this._height-1;
	for (var i=0;i<=w;i++) {
		for (var j=0;j<=h;j++) {
			var empty = (i && j && i<w && j<h);
			callback(i, j, !empty);
		}
	}
}
