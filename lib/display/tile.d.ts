import Backend from "./backend.js";
import { DisplayOptions, DisplayData } from "./types.js";
/**
 * @class Tile backend
 * @private
 */
export default class Tile extends Backend {
    _colorCanvas: HTMLCanvasElement;
    constructor(context: CanvasRenderingContext2D);
    compute(options: DisplayOptions): void;
    draw(data: DisplayData, clearBefore: boolean): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(): number;
    eventToPosition(x: number, y: number): [number, number];
}
