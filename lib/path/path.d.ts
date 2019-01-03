export declare type ComputeCallback = (x: number, y: number) => any;
export declare type PassableCallback = (x: number, y: number) => boolean;
export interface Options {
    topology: 4 | 6 | 8;
}
/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
export default abstract class Path {
    _toX: number;
    _toY: number;
    _passableCallback: PassableCallback;
    _options: Options;
    _dirs: number[][];
    constructor(toX: number, toY: number, passableCallback: PassableCallback, options?: Partial<Options>);
    /**
     * Compute a path from a given point
     * @param {int} fromX
     * @param {int} fromY
     * @param {function} callback Will be called for every path item with arguments "x" and "y"
     */
    abstract compute(fromX: number, fromY: number, callback: ComputeCallback): void;
    _getNeighbors(cx: number, cy: number): number[][];
}
