import Backend from "./backend.js";
import { DisplayOptions } from "./types.js";
export default abstract class Canvas extends Backend {
    _ctx: CanvasRenderingContext2D;
    constructor();
    schedule(cb: () => void): void;
    getContainer(): HTMLCanvasElement;
    setOptions(opts: DisplayOptions): void;
    clear(): void;
    eventToPosition(x: number, y: number): [number, number];
    abstract _normalizedEventToPosition(x: number, y: number): [number, number];
    abstract _updateSize(): void;
}
