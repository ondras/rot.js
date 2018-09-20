import Backend from "./backend.js";
import { DisplayOptions, DisplayData } from "./types.js";
/**
 * @class Rectangular backend
 * @private
 */
export default class Rect extends Backend {
    _spacingX: number;
    _spacingY: number;
    _canvasCache: {
        [key: string]: HTMLCanvasElement;
    };
    _options: DisplayOptions;
    static cache: boolean;
    constructor(context: CanvasRenderingContext2D);
    compute(options: DisplayOptions): void;
    draw(data: DisplayData, clearBefore: boolean): void;
    _drawWithCache(data: DisplayData): void;
    _drawNoCache(data: DisplayData, clearBefore: boolean): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(availWidth: number, availHeight: number): number;
    eventToPosition(x: number, y: number): [number, number];
}
