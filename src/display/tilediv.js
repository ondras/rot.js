/**
 * @class Tile backend
 * @private
 */
ROT.Display.Tilediv = function(context) {
	ROT.Display.Rect.call(this, context);
	this._options = {};
}
ROT.Display.Tilediv.extend(ROT.Display.Tile);

ROT.Display.Tilediv.prototype.compute = function(options) {
	this._options = options;
	this._context.style.width = options.width * options.tileWidth + "px";
	this._context.style.height = options.height * options.tileHeight + "px";
}

ROT.Display.Tilediv.MIN_LIGHT = 80;

ROT.Display.Tilediv.prototype.draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var tileWidth = this._options.tileWidth;
	var tileHeight = this._options.tileHeight;

	var id = "" + x + "," + y;
	var div = document.getElementById(id);
	if(!div) {
		div = this.createTileDiv(id, x, y, tileWidth, tileHeight);
		this._context.appendChild(div);
	}
	var id_color = "c" + x + "," + y;
	var div_color = document.getElementById(id_color);
	if(!div_color) {
		div_color = this.createColorDiv(id_color, x, y, tileWidth, tileHeight);
		this._context.appendChild(div_color);
	}

	if (clearBefore) {
		div.style.backgroundPosition = "0 0";
		div.style.backgroundColor = "transparent";
		div.style.color = "transparent";
	}

	// light
	div_color.style.backgroundColor = fg;	
	var fg_color = ROT.Color.fromString(div_color.style.backgroundColor);

	// save color in the div for debugging
	div_color.setAttribute("data-fg", div_color.style.backgroundColor);
	div_color.setAttribute("data-fg_color", ROT.Color.toHex(fg_color));

	// approximate alpha value from the color
	var opacity = 0.5 +
		(fg_color[0] < ROT.Display.Tilediv.MIN_LIGHT ? 0.1666 * (1 - fg_color[0] / ROT.Display.Tilediv.MIN_LIGHT) : 0) +
		(fg_color[1] < ROT.Display.Tilediv.MIN_LIGHT ? 0.1666 * (1 - fg_color[1] / ROT.Display.Tilediv.MIN_LIGHT) : 0) +
		(fg_color[2] < ROT.Display.Tilediv.MIN_LIGHT ? 0.1666 * (1 - fg_color[2] / ROT.Display.Tilediv.MIN_LIGHT) : 0);
	div_color.style.opacity = opacity;

	if (!ch) { return; }

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		var tile = this._options.tileMap[chars[i]];
		if (!tile) { throw new Error("Char '" + chars[i] + "' not found in tileMap"); }

		div.style.backgroundPosition = "-" + tile[0] + "px -" + tile[1] + "px";
	}
}

ROT.Display.Tilediv.prototype.createTileDiv = function(id, x, y, tileWidth, tileHeight) {
	div = document.createElement("div");
	div.id = id;
	div.className = "tile";
	div.style.position = "absolute";
	div.style.left = (x*tileWidth) + "px";
	div.style.top = (y*tileHeight) + "px";
	div.style.width = tileWidth + "px";
	div.style.height = tileHeight + "px";
	div.style.backgroundImage = "url(" + this._options.tileSet.src + ")";
	div.style.zIndex = 10;
	div.style.backgroundColor = "inherit";
	return div;
}

ROT.Display.Tilediv.prototype.createColorDiv = function(id, x, y, tileWidth, tileHeight) {
	div_color = document.createElement("div");
	div_color.id = id;
	div_color.className = "color";
	div_color.style.position = "absolute";
	div_color.style.left = (x*tileWidth) + "px";
	div_color.style.top = (y*tileHeight) + "px";
	div_color.style.width = tileWidth + "px";
	div_color.style.height = tileHeight + "px";
	div_color.style.zIndex = 20;
	return div_color;
}

ROT.Display.Tilediv.prototype.clear = function() {
}

