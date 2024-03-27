import { DisplayOptions, DisplayData, IDisplayBackend } from "./types.js";

/**
 * @class Abstract display backend module
 * @private
 */
export default abstract class Backend implements IDisplayBackend {
	_options!: DisplayOptions;

	getContainer(): HTMLElement | null { return null; }

	abstract checkOptions(options: DisplayOptions): boolean;
	setOptions(options: DisplayOptions) {
		// return true if this change dirties the whole display
		const { width, height, layout } = this._options ?? {};
		this._options = {...options};
		return width !== options.width || height !== options.height || layout !== options.layout;
	}

	abstract schedule(cb: ()=>void): void;
	abstract clear(): void;
	abstract draw(data: DisplayData, clearBefore: boolean): void;
	abstract computeSize(availWidth: number, availHeight: number): [number, number];
	abstract computeFontSize(availWidth: number, availHeight: number): number;
	abstract eventToPosition(x:number, y:number): [number, number];
}
