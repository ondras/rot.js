import Map, { CreateCallback } from "./map.js";
declare type Room = [number, number, number, number];
/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
export default class DividedMaze extends Map {
    _stack: Room[];
    _map: number[][];
    create(callback: CreateCallback): this;
    _process(): void;
    _partitionRoom(room: Room): void;
}
export {};
