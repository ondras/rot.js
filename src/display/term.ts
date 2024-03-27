import Backend from "./backend.js";
import { BaseDisplayOptions, DisplayData, DisplayOptions } from "./types.js";
import * as Color from "../color.js";

declare module "./types.js" {
	interface LayoutTypeBackendMap<TOptions extends DisplayOptions> {
		term: Term;
	}
}

// Explicitly declaring this so that including projects don't need to import node types
declare global {
	namespace NodeJS {
		interface WriteStream 
		{
			rows: number;
			columns: number;
			write(data: string): any;
		}
		interface Process {
			stdout: WriteStream & { fd: 1; } 
		}
	}
	var process: NodeJS.Process;
}

function clearToAnsi(bg: string) {
	return `\x1b[0;48;5;${termcolor(bg)}m\x1b[2J`;
}

function colorToAnsi(fg: string, bg: string) {
	return `\x1b[0;38;5;${termcolor(fg)};48;5;${termcolor(bg)}m`;
}

function positionToAnsi(x: number, y: number) {
	return `\x1b[${y+1};${x+1}H`;
}

function termcolor(color: string) {
	const SRC_COLORS = 256.0;
	const DST_COLORS = 6.0;
	const COLOR_RATIO = DST_COLORS / SRC_COLORS;
	let rgb = Color.fromString(color);
	let r = Math.floor(rgb[0] * COLOR_RATIO);
	let g = Math.floor(rgb[1] * COLOR_RATIO);
	let b = Math.floor(rgb[2] * COLOR_RATIO);
	return r*36 + g*6 + b*1 + 16;
}

export interface TermOptions extends BaseDisplayOptions {
	layout: "term";
}
export interface TermData extends DisplayData<string, string, string> {
}

export default class Term extends Backend<TermOptions, string, string, string, TermData> {
	_offset: [number, number];
	_cursor: [number, number];
	_lastColor: string;

	constructor() {
		super();
		this._offset = [0, 0];
		this._cursor = [-1, -1];
		this._lastColor = "";
	}

	schedule(cb: ()=>void) { setTimeout(cb, 1000/60); }

	checkOptions(options: DisplayOptions): options is TermOptions {
		return options.layout === "term";
	}
	setOptions(options: TermOptions) {
		let needsRepaint = super.setOptions(options);
		let size = [this._options.width, this._options.height];
		let avail = this.computeSize();
		this._offset = avail.map((val, index) => Math.floor((val as number - size[index])/2)) as [number, number];
		return needsRepaint;
	}

	protected defaultedOptions(options: TermOptions): Required<TermOptions> {
		const [width, height] = this.computeSize();
		return {
			...this.DEFAULTS,
			width, height,
			...options,
		};
	}

	clear() {
		process.stdout.write(clearToAnsi(this._options.bg));
	}

	draw(data: TermData, clearBefore: boolean) {
		// determine where to draw what with what colors
		let {x, y, ch, fg, bg} = data;

		// determine if we need to move the terminal cursor
		let dx = this._offset[0] + x;
		let dy = this._offset[1] + y;
		let size = this.computeSize();
		if (dx < 0 || dx >= size[0]) { return; }
		if (dy < 0 || dy >= size[1]) { return; }
		if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
			process.stdout.write(positionToAnsi(dx, dy));
			this._cursor[0] = dx;
			this._cursor[1] = dy;
		}

		// terminals automatically clear, but if we're clearing when we're
		// not otherwise provided with a character, just use a space instead
		if (clearBefore) {
			if (!ch) { ch = " "; }
		}
			
		// if we're not clearing and not provided with a character, do nothing
		if (!ch) { return; }

		// determine if we need to change colors
		let newColor = colorToAnsi(fg, bg);
		if (newColor !== this._lastColor) {
			process.stdout.write(newColor);
			this._lastColor = newColor;
		}

		if (ch != '\t') {
			// write the provided symbol to the display
			let chars = ([] as string[]).concat(ch);
			process.stdout.write(chars[0]);
		}

		// update our position, given that we wrote a character
		this._cursor[0]++;
		if (this._cursor[0] >= size[0]) {
			this._cursor[0] = 0;
			this._cursor[1]++;
		}
	}

	computeFontSize(): number { throw new Error("Terminal backend has no notion of font size"); }
	eventToPosition(x:number, y:number) { return [x, y] as [number, number]; }
	computeSize() { return [process.stdout.columns, process.stdout.rows] as [number, number]; }
}
