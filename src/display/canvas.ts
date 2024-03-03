import Backend from "./backend.js";
import { DisplayOptions } from "./types.js";

export default abstract class Canvas extends Backend {
	_ctx: CanvasRenderingContext2D;

	constructor() {
		super();
		this._ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
	}

	schedule(cb: () => void) { requestAnimationFrame(cb); }
	getContainer() { return this._ctx.canvas; }

	setOptions(opts: DisplayOptions) {
		super.setOptions(opts);

		const style = (opts.fontStyle ? `${opts.fontStyle} ` : ``);
		const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
		this._ctx.font = font;
		this._updateSize();

		this._ctx.font = font;
		this._ctx.textAlign = "center";
		this._ctx.textBaseline = "middle";
	}

	clear() {
		const oldComposite = this._ctx.globalCompositeOperation;
		this._ctx.globalCompositeOperation = "copy"
		this._ctx.fillStyle = this._options.bg;
		this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
		this._ctx.globalCompositeOperation = oldComposite;
	}

	eventToPosition(x: number, y: number): [number, number] {
		let canvas = this._ctx.canvas;
		let rect = canvas.getBoundingClientRect();
		x -= rect.left;
		y -= rect.top;
		
		x *= canvas.width / rect.width;
		y *= canvas.height / rect.height;

		if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) { return [-1, -1]; }

		return this._normalizedEventToPosition(x, y);
	}

	abstract _normalizedEventToPosition(x: number, y: number): [number, number];
	abstract _updateSize(): void;
}
