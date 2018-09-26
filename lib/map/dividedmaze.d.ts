import Map, { CreateCallback } from "./map.js";
declare type Room = [number, number, number, number];
export default class DividedMaze extends Map {
    _stack: Room[];
    _map: number[][];
    create(callback: CreateCallback): this;
    _process(): void;
    _partitionRoom(room: Room): void;
}
export {};
