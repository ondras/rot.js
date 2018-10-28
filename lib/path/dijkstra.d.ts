import Path, { ComputeCallback, PassableCallback, Options } from "./path.js";
interface Item {
    x: number;
    y: number;
    prev: Item | null;
}
export default class Dijkstra extends Path {
    _computed: {
        [key: string]: Item;
    };
    _todo: Item[];
    constructor(toX: number, toY: number, passableCallback: PassableCallback, options: Partial<Options>);
    compute(fromX: number, fromY: number, callback: ComputeCallback): void;
    _compute(fromX: number, fromY: number): void;
    _add(x: number, y: number, prev: Item | null): void;
}
export {};
