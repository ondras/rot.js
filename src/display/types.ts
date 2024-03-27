export interface LayoutTypeBackendMap {
	// Entries in this map are added via declaration merging, see the top of e.g. rect.ts
}

export type LayoutType = {[TLayout in keyof LayoutTypeBackendMap]: TLayout}[keyof LayoutTypeBackendMap];
export type UnknownBackend = IDisplayBackend;

export interface DisplayOptions {
	width: number;
	height: number;
	transpose: boolean;
	layout: LayoutType;
	fontSize: number;
	spacing: number;
	border: number;
	forceSquareRatio: boolean;
	fontFamily: string;
	fontStyle: string;
	fg: string;
	bg: string;
	tileWidth: number;
	tileHeight: number;
	tileMap: { [key: string]: [number, number] };
	tileSet: null | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap;
	tileColorize: Boolean;
}

import type Display from "./display.js"; // for jsdoc only

/**
 * DisplayData contains sll the information needed to draw a single cell (x,y coordinate) of the {@link Display}.
 * The Display object is responsible for creating, keeping track of, and updating these objects, and it passes
 * them to {@link IDisplayBackend.draw()}.
 * 
 * The data for a single display cell comprises, generally speaking, three things:
 * 1. What "character" or "characters" to draw - the quotes because not all backends parse this value as an
 *    actual text character. The tile backends, for example, only use them as index into the tileMap.
 * 2. What style to use while drawing them, e.g. what color to use
 * 3. What style to use for the backdrop or backdrops behind the characters
 * 
 * Each of these can be passed as either a single value or as an array, so each component is stored in two
 * forms:
 * 1. as an array whose elements are mutated with each call to the {@link Display.draw()} family of
 *    methods: {@link chars}, {@link fgs}, {@link bgs}
 * 2. as the actual object or value passed by the user to the appropriate parameter of the Display method:
 * 	  {@link ch}, {@link fg}, {@link bg}
 * 
 * Since the arrays for the former three are created only once (the first time that cell is drawn to), this
 * means that the draw* methods are never required to instantiate objects that will have to be garbage collected.
 * Storing these as an object rather than array is also a slight performance optimization for the Backend's
 * draw() method, as object destructuring assignment does not require instantiating an Iterator the way that array
 * destructuring does.
 */
export interface DisplayData {
	/** X coordinate of display cell. */
	readonly x: number;
	/** Y coordinate of display cell. */
	readonly y: number;

	// Normalized array forms of data
	readonly chars: string[];
	readonly fgs: string[];
	readonly bgs: string[];

	// User-passed data
	ch: string | string[] | null;
	fg: string;
	bg: string;
}

/**
 * This is the contract a Backend must satisfy for it to be used by a Display.
 */
export interface IDisplayBackend {
	/**
	 * Get the root-level HTMLElement containing this display, or null if this backend is unrelated to HTML
	 */
	getContainer(): HTMLElement | null;
	/**
	 * Check if this backend instance is capable of supporting the requested options. Returning false will cause the Display to construct a new one.
	 * @param options The full (defaulted) set of options from the Display
	 * @returns `true` if setOptions() can be called with this argument
	 */
	checkOptions(options: DisplayOptions): boolean;
	/**
	 * Set the options for this backend, and report whether a full repaint is needed.
	 * @param options The full (defaulted) set of options from the Display
	 * @returns `true` if the Display must do a full repaint after this
	 */
	setOptions(options: DisplayOptions): boolean;
	/**
	 * Schedule a callback at the next appropriate time to perform drawing updates.
	 * @param cb The callback to schedule.
	 */
	schedule(cb: ()=>void): void;
	/**
	 * Clear the entire display, resetting it to the color specified by {@link DisplayOptions.bg}.
	 */
	clear(): void;
	/**
	 * Draw the specified cell.
	 * @param data The data to draw.
	 * @param clearBefore Whether to clear the cell to transparent prior to drawing. This will always be set if
	 * 					  `data.bg` is not equal to {@link DisplayOptions.bg}, and also if this cell
	 * 					  has been drawn since the last call to {@link clear()}.
	 */
	draw(data: DisplayData, clearBefore: boolean): void;
	/**
	 * Compute the maximum width/height to fit into a set of given constraints. See {@link Display.computeSize()}.
	 */
	computeSize(availWidth: number, availHeight: number): [number, number];
	/**
	 * Compute the maximum font size to fit into a set of given constraints. See {@link Display.computeFontSize()}.
	 * If this backend does not support the concept of font size, it should throw an Error.
	 */
	computeFontSize(availWidth: number, availHeight: number): number;
	/**
	 * Convert a pair of pixel coordinates to display coordinates. See {@link Display.eventToPosition()}.
	 * @param x The x coordinate of the event, in pixels or display-specific equivalent.
	 * @param y The y coordinate.
	 * @returns The zero-based x and y coordinates of the display cell at position ({@link x}, {@link y}), as a two-element array.
	 */
	eventToPosition(x:number, y:number): [number, number];
}