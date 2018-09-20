import Backend from "./backend.js";
import { DisplayOptions, DisplayData } from "./types.js";
/**
 * @class Hexagonal backend
 * @private
 */
export default class Hex extends Backend {
    _spacingX: number;
    _spacingY: number;
    _hexSize: number;
    constructor(context: CanvasRenderingContext2D);
    compute(options: DisplayOptions): void;
    draw(data: DisplayData, clearBefore: boolean): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(availWidth: number, availHeight: number): number;
    eventToPosition(x: number, y: number): [number, number];
    /**
     * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
     */
    _fill(cx: number, cy: number): void;
}
