import Backend from "./backend.js";
import Hex from "./hex.js";
import Rect from "./rect.js";
import Tile from "./tile.js";
import { DisplayOptions, DisplayData } from "./types.js";
export default class Display {
    _context: CanvasRenderingContext2D;
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
    constructor(options?: Partial<DisplayOptions>);
    DEBUG(x: number, y: number, what: number): void;
    clear(): void;
    setOptions(options: Partial<DisplayOptions>): this;
    getOptions(): DisplayOptions;
    getContainer(): HTMLCanvasElement;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(availWidth: number, availHeight: number): number;
    computeTileSize(availWidth: number, availHeight: number): number[];
    eventToPosition(e: TouchEvent | MouseEvent): number[];
    draw(x: number, y: number, ch: string | string[] | null, fg: string | null, bg: string | null): void;
    drawText(x: number, y: number, text: string, maxWidth?: number): number;
    _tick(): void;
    _draw(key: string, clearBefore: boolean): void;
}
