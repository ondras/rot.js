/**
 * @class Tile backend
 * @private
 */
ROT.Display.Tile = function(context) {
	ROT.Display.Rect.call(this, context);
	
	this._options = {};
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

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		var tile = this._options.tileMap[chars[i]];
		if (!tile) { throw new Error("Char '" + chars[i] + "' not found in tileMap"); }
		
		var bufferCanvas = document.createElement("canvas");
		bufferCanvas.width = tileWidth;
		bufferCanvas.height = tileHeight;

		var buffer = bufferCanvas.getContext("2d");

		buffer.clearRect(0, 0, tileWidth, tileHeight)

		buffer.drawImage(
			this._options.tileSet,
			tile[0], tile[1], tileWidth, tileHeight,
			0, 0, tileWidth, tileHeight
		);

		if (fg != 'transparent') {
			buffer.fillStyle = fg;
			buffer.globalCompositeOperation = "source-atop";
			buffer.fillRect(0, 0, tileWidth, tileHeight);
		}

		if (bg != 'transparent') {
			buffer.fillStyle = bg;
			buffer.globalCompositeOperation = "destination-atop";
			buffer.fillRect(0, 0, tileWidth, tileHeight);
		}

		buffer.restore();

		this._context.drawImage(bufferCanvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight)

		bufferCanvas = null
		
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

ROT.Display.Tile.prototype.eventToPosition = function(x, y) {
	return [Math.floor(x/this._options.tileWidth), Math.floor(y/this._options.tileHeight)];
}
