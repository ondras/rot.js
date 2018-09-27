export declare type ComputeCallback = (x: number, y: number) => any;
export declare type PassableCallback = (x: number, y: number) => boolean;
export interface Options {
    topology: 4 | 6 | 8;
}
export default abstract class Path {
    _toX: number;
    _toY: number;
    _passableCallback: PassableCallback;
    _options: Options;
    _dirs: number[][];
    constructor(toX: number, toY: number, passableCallback: PassableCallback, options?: Partial<Options>);
    abstract compute(fromX: number, fromY: number, callback: ComputeCallback): void;
    _getNeighbors(cx: number, cy: number): number[][];
}
