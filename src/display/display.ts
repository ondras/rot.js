import Hex from "./hex.js";
import Rect from "./rect.js";
import Tile from "./tile.js";
import TileGL from "./tile-gl.js";
import Term from "./term.js";

import * as Text from "../text.js";
import { DisplayOptions, DisplayData, LayoutType, IDisplayBackend, UnknownBackend, LayoutOptions, BaseDisplayOptions, Frozen } from "./types.js";

export const BACKENDS: {[TLayout in LayoutType]: new(oldBackend?: UnknownBackend) => IDisplayBackend<LayoutOptions<TLayout>>} = {
	"hex": Hex,
	"rect": Rect,
	"tile": Tile,
	"tile-gl": TileGL,
	"term": Term
}

/**
 * @class Visual map display
 */
class DisplayImpl<TLayout extends LayoutType> {
	static readonly DEFAULT_LAYOUT = "rect" satisfies LayoutType;

	_data: { [pos:string] : DisplayData };
	_dirty: boolean | { [pos: string]: boolean };
	_options!: LayoutOptions<TLayout> & Required<BaseDisplayOptions>;
	_backend!: IDisplayBackend<LayoutOptions<TLayout>>;

	static Rect = Rect;
	static Hex = Hex;
	static Tile = Tile;
	static TileGL = TileGL;
	static Term = Term;

	constructor(options?: DisplayOptions) {
		this._data = {};
		this._dirty = false; // false = nothing, true = all, object = dirty cells

		options = {layout: Display.DEFAULT_LAYOUT, ...options} as DisplayOptions;
		this.setOptions(options);
		this.DEBUG = this.DEBUG.bind(this);

		this._tick = this._tick.bind(this);
		this._backend.schedule(this._tick);
	}

	/**
	 * Debug helper, ideal as a map generator callback. Always bound to this.
	 * @param {int} x
	 * @param {int} y
	 * @param {int} what
	 */
	DEBUG(x: number, y: number, what: number) {
		let colors = [this._options.bg, this._options.fg];
		this.draw(x, y, null, null, colors[what % colors.length]);
	}

	/**
	 * Clear the whole display (cover it with background color)
	 */
	clear() {
		this._data = {};
		this._dirty = true;
	}

	/**
	 * @see ROT.Display
	 */
	setOptions(options: Omit<LayoutOptions<TLayout>, "layout"> | DisplayOptions) {
		this._options = Object.assign(this._options ?? {}, options);

		if (!this._backend?.checkOptions(this._options)) {
			// This is either the initial backend or a backend switch
			const ctor = BACKENDS[this._options.layout];
			this._backend = new ctor(this._backend) as any;
			if (!this._backend.checkOptions(this._options)) {
				console.error("checkOptions returned false on a newly-constructed backend! This is probably a bug in rot.js.", options, this._backend, this._options);
				throw new Error("could not construct display backend");
			}
		}

		if (this._backend.setOptions(this._options)) {
			this._dirty = true;
		}
		return this;
	}

	/**
	 * Returns currently set options
	 * @param getEffectiveOptions When true or omitted, returns the set of active options in use by the backend. When false,
	 * 							  returns the options that were passed to the Display constructor or to {@link setOptions()}.
	 */
	getOptions(getEffectiveOptions?: true): Frozen<LayoutOptions<TLayout>>;
	getOptions(getEffectiveOptions: false): DisplayOptions;
	getOptions(getEffectiveOptions: boolean): Frozen<LayoutOptions<TLayout>> | DisplayOptions;
	getOptions(getEffectiveOptions = true): Frozen<LayoutOptions<TLayout>> | DisplayOptions { return getEffectiveOptions ? this._backend.getOptions() : this._options; }

	/**
	 * Returns the DOM node of this display
	 */
	getContainer() { return this._backend.getContainer(); }

	/**
	 * Compute the maximum width/height to fit into a set of given constraints
	 * @param {int} availWidth Maximum allowed pixel width
	 * @param {int} availHeight Maximum allowed pixel height
	 * @returns {int[2]} cellWidth,cellHeight
	 */
	computeSize(availWidth: number, availHeight: number) {
		return this._backend.computeSize(availWidth, availHeight);
	}

	/**
	 * Compute the maximum font size to fit into a set of given constraints
	 * @param {int} availWidth Maximum allowed pixel width
	 * @param {int} availHeight Maximum allowed pixel height
	 * @returns {int} fontSize
	 */
	computeFontSize(availWidth: number, availHeight: number) {
		return this._backend.computeFontSize(availWidth, availHeight);
	}

	computeTileSize(availWidth: number, availHeight: number) {
		let width = Math.floor(availWidth / this._options.width);
		let height = Math.floor(availHeight / this._options.height);
		return [width, height];		
	}

	/**
	 * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
	 * @param {Event} e event
	 * @returns {int[2]} -1 for values outside of the canvas
	 */
	eventToPosition(e: TouchEvent | MouseEvent) {
		let x, y;
		if ("touches" in e) {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			x = e.clientX;
			y = e.clientY;
		}

		return this._backend.eventToPosition(x, y);
	}

	/**
	 * @param x
	 * @param y
	 * @param ch One or more chars (will be overlapping themselves)
	 * @param fg foreground color
	 * @param bg background color
	 */
	draw(x: number, y: number, ch: string | string[] | null, fg: string | null = null, bg: string | null = null) {
		let key = `${x},${y}`;
		const data = this._data[key] ??= {x, y, chars: [], fgs: [], bgs: [], ch: null!, fg: null!, bg: null!};
		if (this._setData(data, ch, fg ?? this._options.fg, bg ?? this._options.bg)) {
			this._setDirty(key);
		}
	}

	_setDirty(key: string) {
		if (this._dirty === true) { return; } // will already redraw everything 
		if (!this._dirty) { this._dirty = {}; } // first!
		this._dirty[key] = true;
	}

	/**
	 * @param x
	 * @param y
	 * @param ch One or more chars (will be overlapping themselves), or null to leave unchanged
	 * @param fg foreground color, or null to leave unchanged
	 * @param bg background color, or null to leave unchanged
	 */
	drawOver(
		x: number,
		y: number,
		ch: string | string[] | null = null,
		fg: string | null = null,
		bg: string | null = null,
	) {
		const key = `${x},${y}`;
		const existing = this._data[key];
		if (existing) {
			ch ??= existing.ch;
			fg ??= existing.fg;
			bg ??= existing.bg;
			if (this._setData(existing, ch, fg, bg)) {
				this._setDirty(key);
			}
		} else {
			this.draw(x, y, ch, fg, bg);
		}
	}

	/**
	 * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
	 * @param {int} x
	 * @param {int} y
	 * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
	 * @param {int} [maxWidth] wrap at what width?
	 * @returns {int} lines drawn
	 */
	drawText(x:number, y:number, text:string, maxWidth?:number) {
		let fg = null;
		let bg = null;
		let cx = x;
		let cy = y;
		let lines = 1;
		if (!maxWidth) { maxWidth = this._options.width-x; }

		let tokens = Text.tokenize(text, maxWidth);

		while (tokens.length) { // interpret tokenized opcode stream
			let token = tokens.shift();
			switch (token.type) {
				case Text.TYPE_TEXT:
					let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
					for (let i=0;i<token.value.length;i++) {
						let cc = token.value.charCodeAt(i);
						let c = token.value.charAt(i);
						if (this._options.layout === "term") {
							let cch = cc >> 8;
							let isCJK = cch === 0x11 || (cch >= 0x2e && cch <= 0x9f) || (cch >= 0xac && cch <= 0xd7) || (cc >= 0xA960 && cc <= 0xA97F);
							if (isCJK) {
								this.draw(cx + 0, cy, c, fg, bg);
								this.draw(cx + 1, cy, "\t", fg, bg);
								cx += 2;
								continue;
							}
						}

						// Assign to `true` when the current char is full-width.
						isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
						// Current char is space, whatever full-width or half-width both are OK.
						isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
						// The previous char is full-width and
						// current char is nether half-width nor a space.
						if (isPrevFullWidth && !isFullWidth && !isSpace) { cx++; } // add an extra position
						// The current char is full-width and
						// the previous char is not a space.
						if(isFullWidth && !isPrevSpace) { cx++; } // add an extra position
						this.draw(cx++, cy, c, fg, bg);
						isPrevSpace = isSpace;
						isPrevFullWidth = isFullWidth;
					}
				break;

				case Text.TYPE_FG:
					fg = token.value || null;
				break;

				case Text.TYPE_BG:
					bg = token.value || null;
				break;

				case Text.TYPE_NEWLINE:
					cx = x;
					cy++;
					lines++;
				break;
			}
		}

		return lines;
	}

	/**
	 * Timer tick: update dirty parts
	 */
	_tick() {
		this._backend.schedule(this._tick);

		if (!this._dirty) { return; }

		if (this._dirty === true) { // draw all
			this._backend.clear();
			for (let id in this._data) { this._draw(id, false); } // redraw cached data 
		} else { // draw only dirty 
			for (let key in this._dirty) { this._draw(key, true); }
		}

		this._dirty = false;
	}

	/**
	 * @param {string} key What to draw
	 * @param {bool} clearBefore Is it necessary to clean before?
	 */
	_draw(key: string, clearBefore: boolean) {
		let data = this._data[key];
		if (data.bg !== this._options.bg) { clearBefore = true; }

		this._backend.draw(data, clearBefore);
	}

	_setData(data: DisplayData, ch: string | string[] | null, fg: string, bg: string) {
		let changed = false;
		if (data.ch !== ch) {
			changed = true;
			data.ch = ch;
		}
		if (data.fg !== fg) {
			changed = true;
			data.fg = fg;
		}
		if (data.bg !== bg) {
			changed = true;
			data.bg = bg;
		}
		changed = setArrayValue(data.chars, ch) || changed;
		changed = setArrayValue(data.fgs, fg) || changed;
		changed = setArrayValue(data.bgs, bg) || changed;

		return changed;
	}
}

function setArrayValue<T>(array: T[], value: T | T[] | null) {
	let changed = false;
	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			if (array.length <= i || array[i] !== value[i]) {
				array[i] = value[i];
				changed = true;
			}
		}
		if (value.length !== array.length) {
			array.length = value.length;
			changed = true;
		}
	} else if (value == null) {
		changed = array.length !== 0;
		array.length = 0;
	} else {
		if (array.length !== 1 || array[0] !== value) {
			// order is important here! setting length before value means that the JS engine might degrade this to a sparse array with worse performance
			array[0] = value;
			array.length = 1;
		}
	}
	return changed;
}

// Redeclaring all public API in the Display interface so that hovers etc show the right name
export interface Display<TLayout extends LayoutType = LayoutType> extends DisplayImpl<TLayout> {
	DEBUG(x: number, y: number, what: number): void;
	clear(): void;
	setOptions(options: LayoutOptions<TLayout>): this;
	getOptions(getEffectiveOptions?: true): Frozen<LayoutOptions<TLayout>>;
	getOptions(getEffectiveOptions: false): DisplayOptions;
	getOptions(getEffectiveOptions: boolean): Frozen<LayoutOptions<TLayout>> | DisplayOptions;
	computeSize(availWidth: number, availHeight: number): [w: number, h: number];
	computeFontSize(availWidth: number, availHeight: number): number;
	computeTileSize(availWidth: number, availHeight: number): [w: number, h: number];
	eventToPosition(e: TouchEvent | MouseEvent): [x: number, y: number];
	draw(x: number, y: number, ch: string | string[] | null, fg?: string | null, bg?: string | null): void;
	drawOver(x: number, y: number, ch?: string | string[] | null, fg?: string | null, bg?: string | null): void;
	drawText(x:number, y:number, text:string, maxWidth?:number): number;
}

type LayoutFor<TOptions extends DisplayOptions> = TOptions extends {layout: infer L} ? NonNullable<L> : typeof DisplayImpl["DEFAULT_LAYOUT"];

// This is, sadly, the only way to be able to explicitly declare the type arguments of the returned Display instance
export interface DisplayConstructor {
	DEFAULT_LAYOUT: LayoutType;
	new<TLayout extends LayoutType = LayoutType,
		TOptions extends LayoutOptions<TLayout> = LayoutOptions<TLayout>>
			(options?: TOptions): Display<LayoutFor<TOptions>>;
}

export const Display: DisplayConstructor = class Display<TLayout extends LayoutType> extends DisplayImpl<TLayout> {
} as any;

export default Display;