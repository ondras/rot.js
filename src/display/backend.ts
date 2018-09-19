import { DisplayOptions, DisplayData } from "./types.js";

/**
 * @class Abstract display backend module
 * @private
 */
export default class Backend {
	_context: CanvasRenderingContext2D;
	_options!: DisplayOptions;

	constructor(context: CanvasRenderingContext2D) { this._context = context; }
	compute(options: DisplayOptions) { this._options = options; }
	draw(data: DisplayData, clearBefore: boolean) {}
	computeSize(availWidth: number, availHeight: number) {}
	computeFontSize(availWidth: number, availHeight: number) {}
	eventToPosition(x:number, y:number) {}
}
