import Backend from "./backend.js";
import Hex from "./hex.js";
import Rect from "./rect.js";
import Tile from "./tile.js";
import Term from "./term.js";
import { DisplayOptions, DisplayData } from "./types.js";
export default class Display {
    _data: {
        [pos: string]: DisplayData;
    };
    _dirty: boolean | {
        [pos: string]: boolean;
    };
    _options: DisplayOptions;
    _backend: Backend;
    static Rect: typeof Rect;
    static Hex: typeof Hex;
    static Tile: typeof Tile;
    static Term: typeof Term;
    constructor(options?: Partial<DisplayOptions>);
    DEBUG(x: number, y: number, what: number): void;
    clear(): void;
    setOptions(options: Partial<DisplayOptions>): this;
    getOptions(): DisplayOptions;
    getContainer(): HTMLElement | null;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(availWidth: number, availHeight: number): number;
    computeTileSize(availWidth: number, availHeight: number): number[];
    eventToPosition(e: TouchEvent | MouseEvent): [number, number];
    draw(x: number, y: number, ch: string | string[] | null, fg: string | null, bg: string | null): void;
    drawText(x: number, y: number, text: string, maxWidth?: number): number;
    _tick(): void;
    _draw(key: string, clearBefore: boolean): void;
}
