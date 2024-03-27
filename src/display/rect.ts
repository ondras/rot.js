import Canvas, { CanvasDisplayData } from "./canvas.js";
import { DefaultsFor, DisplayOptions, TextDisplayOptions } from "./types.js";

declare module "./types.js" {
	interface LayoutTypeBackendMap<TOptions extends DisplayOptions> {
		rect: Rect;
	}
}

export interface RectOptions extends TextDisplayOptions {
	layout?: "rect";
	forceSquareRatio?: boolean;
}

export interface RectData extends CanvasDisplayData {
}

/**
 * @class Rectangular backend
 * @private
 */
export default class Rect extends Canvas<RectOptions, RectData> {
	protected get DEFAULTS() {
		return {
			...super.DEFAULTS,
			forceSquareRatio: false,
		} satisfies DefaultsFor<RectOptions>;
	}
	_spacingX: number = 0;
	_spacingY: number = 0;
	_canvasCache: {[key:string]: HTMLCanvasElement} = {};

	static cache = false;

	checkOptions(options: DisplayOptions): options is RectOptions {
		return options.layout === "rect" || !options.layout;
	}
	setOptions(options: RectOptions) {
		this._canvasCache = {};
		return super.setOptions(options);
	}

	protected defaultedOptions(options: RectOptions): Required<RectOptions> {
		return {
			...this.DEFAULTS,
			...options,
		}
	}

	draw(data: RectData, clearBefore: boolean) {
		if (Rect.cache) {
			this._drawWithCache(data);
		} else {
			this._drawNoCache(data, clearBefore);
		}
	}

	_drawWithCache(data: RectData) {
		const {x, y, ch, chars, fg, bg} = data;

		let hash = ""+ch+fg+bg;
		let canvas;
		if (hash in this._canvasCache) {
			canvas = this._canvasCache[hash];
		} else {
			let b = this._options.border;
			canvas = document.createElement("canvas");
			let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
			canvas.width = this._spacingX;
			canvas.height = this._spacingY;
			ctx.fillStyle = bg;
			ctx.fillRect(b, b, canvas.width-b, canvas.height-b);
			
			if (chars.length) {
				ctx.fillStyle = fg;
				ctx.font = this._ctx.font;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				for (let i=0;i<chars.length;i++) {
					ctx.fillText(chars[i], this._spacingX/2, Math.ceil(this._spacingY/2));
				}
			}
			this._canvasCache[hash] = canvas;
		}
		
		this._ctx.drawImage(canvas, x*this._spacingX, y*this._spacingY);
	}

	_drawNoCache(data: RectData, clearBefore: boolean) {
		const {x, y, chars, fg, bg} = data;

		if (clearBefore) { 
			let b = this._options.border;
			this._ctx.fillStyle = bg;
			this._ctx.fillRect(x*this._spacingX + b, y*this._spacingY + b, this._spacingX - b, this._spacingY - b);
		}
		
		if (!chars.length) { return; }

		this._ctx.fillStyle = fg;

		for (let i=0;i<chars.length;i++) {
			this._ctx.fillText(chars[i], (x+0.5) * this._spacingX, Math.ceil((y+0.5) * this._spacingY));
		}
	}

	computeSize(availWidth: number, availHeight: number): [number, number] {
		let width = Math.floor(availWidth / this._spacingX);
		let height = Math.floor(availHeight / this._spacingY);
		return [width, height];
	}

	computeFontSize(availWidth: number, availHeight: number) {
		let boxWidth = Math.floor(availWidth / this._options.width);
		let boxHeight = Math.floor(availHeight / this._options.height);

		/* compute char ratio */
		let oldFont = this._ctx.font;
		this._ctx.font = "100px " + this._options.fontFamily;
		let width = Math.ceil(this._ctx.measureText("W").width);
		this._ctx.font = oldFont;
		let ratio = width / 100;
			
		let widthFraction = ratio * boxHeight / boxWidth;
		if (widthFraction > 1) { /* too wide with current aspect ratio */
			boxHeight = Math.floor(boxHeight / widthFraction);
		}
		return Math.floor(boxHeight / this._options.spacing);
	}

	_normalizedEventToPosition(x:number, y:number): [number, number] {
		return [Math.floor(x/this._spacingX), Math.floor(y/this._spacingY)];
	}

	_updateSize() {
		const opts = this._options;
		const charWidth = Math.ceil(this._ctx.measureText("W").width);
		this._spacingX = Math.ceil(opts.spacing * charWidth);
		this._spacingY = Math.ceil(opts.spacing * opts.fontSize);

		if (opts.forceSquareRatio) {
			this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
		}

		this._ctx.canvas.width = opts.width * this._spacingX;
		this._ctx.canvas.height = opts.height * this._spacingY;
	}
}
