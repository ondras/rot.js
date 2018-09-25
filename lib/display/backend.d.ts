import { DisplayOptions, DisplayData } from "./types.js";
export default abstract class Backend {
    _context: CanvasRenderingContext2D;
    _options: DisplayOptions;
    constructor(context: CanvasRenderingContext2D);
    compute(options: DisplayOptions): void;
    abstract draw(data: DisplayData, clearBefore: boolean): void;
    abstract computeSize(availWidth: number, availHeight: number): [number, number];
    abstract computeFontSize(availWidth: number, availHeight: number): number;
    abstract eventToPosition(x: number, y: number): [number, number];
}
