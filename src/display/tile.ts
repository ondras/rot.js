import { BaseCanvas } from "./canvas.js";
import { TileDisplayOptions, DisplayData, UnknownBackend, TileMapKey, DefaultsFor, DisplayOptions } from "./types.js";

declare module "./types.js" {
	interface LayoutTypeBackendMap<TOptions extends DisplayOptions> {
		"tile": Tile<TOptions extends {tileMap: Record<infer TKey, any>} ? TKey : string>;
	}
}

export interface TileOptions<TChar extends TileMapKey = string> extends TileDisplayOptions<TChar> {
	layout: "tile";
}
export interface TileData<TChar extends TileMapKey> extends DisplayData<TChar[], string[], string[]> {
}

/**
 * @class Tile backend
 * @private
 */
export default class Tile<TChar extends TileMapKey = string> extends BaseCanvas<TileOptions<TChar>, TileData<TChar>, TChar[], string[], string[]> {
	_colorCanvas: HTMLCanvasElement;

	protected get DEFAULTS() {
		return {
			...super.DEFAULTS,
			tileWidth: 32,
			tileHeight: 32,
			tileColorize: false,
		} satisfies DefaultsFor<TileOptions<never>>;
	}

	constructor(oldBackend?: UnknownBackend) {
		super(oldBackend);
		this._colorCanvas = oldBackend instanceof Tile ? oldBackend._colorCanvas : document.createElement("canvas");
	}

	checkOptions(options: DisplayOptions): options is TileOptions<TChar> {
		return options.layout === "tile";
	}

	protected defaultedOptions(options: TileOptions<TChar>): Required<TileOptions<TChar>> {
		return {
			...this.DEFAULTS,
			...options,
		}
	}

	draw(data: TileData<TChar>, clearBefore: boolean) {
		const {x, y, chars, fgs, bgs} = data;

		let tileWidth = this._options.tileWidth;
		let tileHeight = this._options.tileHeight;

		if (clearBefore) {
			if (this._options.tileColorize) {
				this._ctx.clearRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
			} else {
                this._ctx.save();
                this._ctx.globalCompositeOperation = "copy";
				this._ctx.fillStyle = bgs[0] ?? this._options.bg;
                this._ctx.beginPath();
                this._ctx.rect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
                this._ctx.clip();
                this._ctx.fill();
                this._ctx.restore();
			}
		}

		if (!chars.length) { return; }

		for (let i=0;i<chars.length;i++) {
			let tile = this._options.tileMap[chars[i]];
			if (!tile) { throw new Error(`Char "${String(chars[i])}" not found in tileMap`); }
			
			if (this._options.tileColorize) { // apply colorization
				let canvas = this._colorCanvas;
				let context = canvas.getContext("2d") as CanvasRenderingContext2D;
				context.globalCompositeOperation = "source-over";
				context.clearRect(0, 0, tileWidth, tileHeight);

				let fg = fgs[i];
				let bg = bgs[i];

				context.drawImage(
					this._options.tileSet!,
					tile[0], tile[1], tileWidth, tileHeight,
					0, 0, tileWidth, tileHeight
				);

				if (fg != "transparent") {
					context.fillStyle = fg;
					context.globalCompositeOperation = "source-atop";
					context.fillRect(0, 0, tileWidth, tileHeight);
				}

				if (bg != "transparent") {
					context.fillStyle = bg;
					context.globalCompositeOperation = "destination-over";
					context.fillRect(0, 0, tileWidth, tileHeight);
				}

				this._ctx.drawImage(canvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
			} else { // no colorizing, easy
				this._ctx.drawImage(
					this._options.tileSet!,
					tile[0], tile[1], tileWidth, tileHeight,
					x*tileWidth, y*tileHeight, tileWidth, tileHeight
				);
			}
		}
	}

	computeSize(availWidth: number, availHeight: number): [number, number] {
		let width = Math.floor(availWidth / this._options.tileWidth);
		let height = Math.floor(availHeight / this._options.tileHeight);
		return [width, height];
	}

	computeFontSize(): number {
		throw new Error("Tile backend does not understand font size");
	}

	_normalizedEventToPosition(x:number, y:number): [number, number] {
		return [Math.floor(x/this._options.tileWidth), Math.floor(y/this._options.tileHeight)];
	}

	_updateSize() {
		const opts = this._options;
		this._ctx.canvas.width = opts.width * opts.tileWidth;
		this._ctx.canvas.height = opts.height * opts.tileHeight;
		this._colorCanvas.width = opts.tileWidth;
		this._colorCanvas.height = opts.tileHeight;
	}
}
