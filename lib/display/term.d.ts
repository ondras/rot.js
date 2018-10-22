import Backend from "./backend.js";
import { DisplayData, DisplayOptions } from "./types.js";
export default class Term extends Backend {
    _offset: [number, number];
    _cursor: [number, number];
    _lastColor: string;
    constructor();
    schedule(cb: () => void): void;
    setOptions(options: DisplayOptions): void;
    clear(): void;
    draw(data: DisplayData, clearBefore: boolean): void;
    computeFontSize(): number;
    eventToPosition(x: number, y: number): [number, number];
    computeSize(): [number, number];
}
