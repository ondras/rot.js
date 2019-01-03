import Canvas from "./canvas.js";
import { DisplayOptions, DisplayData } from "./types.js";
/**
 * @class Rectangular backend
 * @private
 */
export default class Rect extends Canvas {
    _spacingX: number;
    _spacingY: number;
    _canvasCache: {
        [key: string]: HTMLCanvasElement;
    };
    _options: DisplayOptions;
    static cache: boolean;
    constructor();
    setOptions(options: DisplayOptions): void;
    draw(data: DisplayData, clearBefore: boolean): void;
    _drawWithCache(data: DisplayData): void;
    _drawNoCache(data: DisplayData, clearBefore: boolean): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(availWidth: number, availHeight: number): number;
    _normalizedEventToPosition(x: number, y: number): [number, number];
    _updateSize(): void;
}
