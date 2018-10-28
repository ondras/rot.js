import { DisplayOptions, DisplayData } from "./types.js";

/**
 * @class Abstract display backend module
 * @private
 */
export default abstract class Backend {
	_options!: DisplayOptions;

	getContainer(): HTMLElement | null { return null; }
	setOptions(options: DisplayOptions) { this._options = options; }

	abstract schedule(cb: ()=>void): void;
	abstract clear(): void;
	abstract draw(data: DisplayData, clearBefore: boolean): void;
	abstract computeSize(availWidth: number, availHeight: number): [number, number];
	abstract computeFontSize(availWidth: number, availHeight: number): number;
	abstract eventToPosition(x:number, y:number): [number, number];
}
