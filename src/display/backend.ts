import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../constants.js";
import { DisplayOptions, DisplayData, IDisplayBackend, DefaultsFor, Frozen, BaseDisplayOptions } from "./types.js";

/**
 * @class Abstract display backend module
 * @private
 */
export default abstract class Backend<TOptions extends BaseDisplayOptions = BaseDisplayOptions,
									  TChar = string, TFGColor = string, TBGColor = string,
									  TData extends DisplayData<TChar, TFGColor, TBGColor> = DisplayData<TChar, TFGColor, TBGColor>,
									 >
							implements IDisplayBackend<TOptions, TData> {
	protected get DEFAULTS() {
		return {
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
			layout: "rect",
			fg: "#ccc",
			bg: "#000",
		} satisfies DefaultsFor<BaseDisplayOptions>;
	}
	_options!: Frozen<TOptions>;

	getContainer(): HTMLElement | null { return null; }

	abstract checkOptions(options: DisplayOptions): options is DisplayOptions & TOptions;
	setOptions(options: TOptions) {
		// return true if this change dirties the whole display
		const { width, height, layout } = this._options ?? {};
		this._options = this.defaultedOptions(options);
		return width !== options.width || height !== options.height || layout !== options.layout;
	}
	protected abstract defaultedOptions(options: TOptions): Frozen<TOptions>;
	getOptions(): Frozen<TOptions> {
		return this._options as Frozen<TOptions>;
	}

	abstract schedule(cb: ()=>void): void;
	abstract clear(): void;
	abstract draw(data: TData, clearBefore: boolean): void;
	abstract computeSize(availWidth: number, availHeight: number): [number, number];
	abstract computeFontSize(availWidth: number, availHeight: number): number;
	abstract eventToPosition(x:number, y:number): [number, number];
}
