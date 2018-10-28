import Map, { CreateCallback } from "./map.js";
export default class IceyMaze extends Map {
    _regularity: number;
    _map: number[][];
    constructor(width: number, height: number, regularity?: number);
    create(callback: CreateCallback): this;
    _randomize(dirs: number[][]): void;
    _isFree(map: number[][], x: number, y: number, width: number, height: number): number | false;
}
