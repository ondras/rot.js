import Map, { CreateCallback } from "./map.js";
/**
 * Icey's Maze generator
 * See http://roguebasin.com/index.php/Simple_maze for explanation
 */
export default class IceyMaze extends Map {
    _regularity: number;
    _map: number[][];
    constructor(width: number, height: number, regularity?: number);
    create(callback: CreateCallback): this;
    _randomize(dirs: number[][]): void;
    _isFree(map: number[][], x: number, y: number, width: number, height: number): number | false;
}
