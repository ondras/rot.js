import Backend from "./backend.js";
import { DisplayOptions, DisplayData } from "./types.js";
import { mod } from "../util.js";

/**
 * @class Hexagonal backend
 * @private
 */
export default class Hex extends Backend {
	_spacingX: number;
	_spacingY: number;
	_hexSize: number;

	constructor(context: CanvasRenderingContext2D) {
		super(context);

		this._spacingX = 0;
		this._spacingY = 0;
		this._hexSize = 0;
	}

	compute(options: DisplayOptions) {
		super.compute(options);

		/* FIXME char size computation does not respect transposed hexes */
		let charWidth = Math.ceil(this._context.measureText("W").width);
		this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth/Math.sqrt(3)) / 2);
		this._spacingX = this._hexSize * Math.sqrt(3) / 2;
		this._spacingY = this._hexSize * 1.5;

		let xprop: "width" | "height";
		let yprop: "width" | "height";
		if (options.transpose) {
			xprop = "height";
			yprop = "width";
		} else {
			xprop = "width";
			yprop = "height";
		}
		this._context.canvas[xprop] = Math.ceil( (options.width + 1) * this._spacingX );
		this._context.canvas[yprop] = Math.ceil( (options.height - 1) * this._spacingY + 2*this._hexSize );
	}

	draw(data: DisplayData, clearBefore: boolean) {
		let [x, y, ch, fg, bg] = data;

		let px = [
			(x+1) * this._spacingX,
			y * this._spacingY + this._hexSize
		];
		if (this._options.transpose) { px.reverse(); }

		if (clearBefore) {
			this._context.fillStyle = bg;
			this._fill(px[0], px[1]);
		}

		if (!ch) { return; }

		this._context.fillStyle = fg;

		let chars = ([] as string[]).concat(ch);
		for (let i=0;i<chars.length;i++) {
			this._context.fillText(chars[i], px[0], Math.ceil(px[1]));
		}
	}

	computeSize(availWidth: number, availHeight: number) {
		if (this._options.transpose) {
			availWidth += availHeight;
			availHeight = availWidth - availHeight;
			availWidth -= availHeight;
		}

		let width = Math.floor(availWidth / this._spacingX) - 1;
		let height = Math.floor((availHeight - 2*this._hexSize) / this._spacingY + 1);
		return [width, height];
	}

	computeFontSize(availWidth: number, availHeight: number) {
		if (this._options.transpose) {
			availWidth += availHeight;
			availHeight = availWidth - availHeight;
			availWidth -= availHeight;
		}

		let hexSizeWidth = 2*availWidth / ((this._options.width+1) * Math.sqrt(3)) - 1;
		let hexSizeHeight = availHeight / (2 + 1.5*(this._options.height-1));
		let hexSize = Math.min(hexSizeWidth, hexSizeHeight);

		/* compute char ratio */
		let oldFont = this._context.font;
		this._context.font = "100px " + this._options.fontFamily;
		let width = Math.ceil(this._context.measureText("W").width);
		this._context.font = oldFont;
		let ratio = width / 100;

		hexSize = Math.floor(hexSize)+1; /* closest larger hexSize */

		/* FIXME char size computation does not respect transposed hexes */
		let fontSize = 2*hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));

		/* closest smaller fontSize */
		return Math.ceil(fontSize)-1;
	}

	eventToPosition(x: number, y: number) {
		let nodeSize;
		if (this._options.transpose) {
			x += y;
			y = x-y;
			x -= y;
			nodeSize = this._context.canvas.width;
		} else {
			nodeSize = this._context.canvas.height;
		}
		let size = nodeSize / this._options.height;
		y = Math.floor(y/size);

		if (mod(y, 2)) { /* odd row */
			x -= this._spacingX;
			x = 1 + 2*Math.floor(x/(2*this._spacingX));
		} else {
			x = 2*Math.floor(x/(2*this._spacingX));
		}

		return [x, y];
	}

	/**
	 * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
	 */
	_fill(cx: number, cy: number) {
		let a = this._hexSize;
		let b = this._options.border;

		this._context.beginPath();

		if (this._options.transpose) {
			this._context.moveTo(cx-a+b,	cy);
			this._context.lineTo(cx-a/2+b,	cy+this._spacingX-b);
			this._context.lineTo(cx+a/2-b,	cy+this._spacingX-b);
			this._context.lineTo(cx+a-b,	cy);
			this._context.lineTo(cx+a/2-b,	cy-this._spacingX+b);
			this._context.lineTo(cx-a/2+b,	cy-this._spacingX+b);
			this._context.lineTo(cx-a+b,	cy);
		} else {
			this._context.moveTo(cx,					cy-a+b);
			this._context.lineTo(cx+this._spacingX-b,	cy-a/2+b);
			this._context.lineTo(cx+this._spacingX-b,	cy+a/2-b);
			this._context.lineTo(cx,					cy+a-b);
			this._context.lineTo(cx-this._spacingX+b,	cy+a/2-b);
			this._context.lineTo(cx-this._spacingX+b,	cy-a/2+b);
			this._context.lineTo(cx,					cy-a+b);
		}
		this._context.fill();
	}
}
