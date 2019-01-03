import Canvas from "./canvas.js";
import { DisplayData } from "./types.js";
/**
 * @class Hexagonal backend
 * @private
 */
export default class Hex extends Canvas {
    _spacingX: number;
    _spacingY: number;
    _hexSize: number;
    constructor();
    draw(data: DisplayData, clearBefore: boolean): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(availWidth: number, availHeight: number): number;
    _normalizedEventToPosition(x: number, y: number): [number, number];
    /**
     * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
     */
    _fill(cx: number, cy: number): void;
    _updateSize(): void;
}
