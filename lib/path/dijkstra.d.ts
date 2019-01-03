import Path, { ComputeCallback, PassableCallback, Options } from "./path.js";
interface Item {
    x: number;
    y: number;
    prev: Item | null;
}
/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
export default class Dijkstra extends Path {
    _computed: {
        [key: string]: Item;
    };
    _todo: Item[];
    constructor(toX: number, toY: number, passableCallback: PassableCallback, options: Partial<Options>);
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX: number, fromY: number, callback: ComputeCallback): void;
    /**
     * Compute a non-cached value
     */
    _compute(fromX: number, fromY: number): void;
    _add(x: number, y: number, prev: Item | null): void;
}
export {};
