import { DisplayOptions, DisplayData } from "./types.js";

/**
 * @class Abstract display backend module
 * @private
 */
export default abstract class Backend {
	_context: CanvasRenderingContext2D;
	_options!: DisplayOptions;

	constructor(context: CanvasRenderingContext2D) { this._context = context; }
	compute(options: DisplayOptions) { this._options = options; }
	abstract draw(data: DisplayData, clearBefore: boolean): void;
	abstract computeSize(availWidth: number, availHeight: number): [number, number];
	abstract computeFontSize(availWidth: number, availHeight: number): number;
	abstract eventToPosition(x:number, y:number): [number, number];
}
