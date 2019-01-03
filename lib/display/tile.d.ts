import Canvas from "./canvas.js";
import { DisplayData } from "./types.js";
/**
 * @class Tile backend
 * @private
 */
export default class Tile extends Canvas {
    _colorCanvas: HTMLCanvasElement;
    constructor();
    draw(data: DisplayData, clearBefore: boolean): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(): number;
    _normalizedEventToPosition(x: number, y: number): [number, number];
    _updateSize(): void;
}
