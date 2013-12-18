/**
 * @class Tile backend
 * @private
 */
ROT.Display.Tile = function(context) {
	ROT.Display.Rect.call(this, context);
	
	this._options = {};
	this._tileCache = {};
}
ROT.Display.Tile.extend(ROT.Display.Rect);

ROT.Display.Tile.prototype.compute = function(options) {
	this._options = options;
	this._context.canvas.width = options.width * options.tileWidth;
	this._context.canvas.height = options.height * options.tileHeight;
}

ROT.Display.Tile.prototype.draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var tileWidth = this._options.tileWidth;
	var tileHeight = this._options.tileHeight;

	if (clearBefore) {
		var b = this._options.border;
		this._context.fillStyle = bg;
		this._context.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
	}

	if (!ch) { return; }

	var fgColor = fg ? ROT.Color.fromString(fg) : false;

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		var tile = this._options.tileMap[chars[i]];
		if (!tile) { throw new Error("Char '" + chars[i] + "' not found in tileMap"); }

		if (fgColor) {
			var cacheKey = tile.concat(fgColor).join(",");
			if (!(cacheKey in this._tileCache)) {
				// create an offscreen canvas to cache our tile
				var canvas = document.createElement("canvas");
				canvas.width = tileWidth;
				canvas.height = tileHeight;
				var context = canvas.getContext("2d");

				// draw the tile into the context
				context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

				// multiply the foreground color times the image data
				var imageData = context.getImageData(0, 0, tileWidth, tileHeight);
				for (i = 0; i < imageData.data.length; i += 4) { // 4 bytes (RGBA) per pixel
					imageData.data[i+0] *= fgColor[0] / 255;
					imageData.data[i+1] *= fgColor[1] / 255;
					imageData.data[i+2] *= fgColor[2] / 255;
				}
				context.putImageData(imageData, 0, 0);

				// update cache
				this._tileCache[cacheKey] = canvas;
				cachedTile = canvas;

			} else {
				cachedTile = this._tileCache[cacheKey];
			}

			this._context.drawImage(cachedTile, x*tileWidth, y*tileHeight);
		}
	}
}

ROT.Display.Tile.prototype.computeSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._options.tileWidth);
	var height = Math.floor(availHeight / this._options.tileHeight);
	return [width, height];
}

ROT.Display.Tile.prototype.computeFontSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._options.width);
	var height = Math.floor(availHeight / this._options.height);
	return [width, height];
}
