import Path, { ComputeCallback, PassableCallback, Options } from "./path.js";
interface Item {
    x: number;
    y: number;
    g: number;
    h: number;
    prev: Item | null;
}
/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
export default class AStar extends Path {
    _todo: Item[];
    _done: {
        [key: string]: Item;
    };
    _fromX: number;
    _fromY: number;
    constructor(toX: number, toY: number, passableCallback: PassableCallback, options?: Partial<Options>);
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX: number, fromY: number, callback: ComputeCallback): void;
    _add(x: number, y: number, prev: Item | null): void;
    _distance(x: number, y: number): number;
}
export {};
