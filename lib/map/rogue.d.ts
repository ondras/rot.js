import Map, { CreateCallback } from "./map.js";
declare type Point = [number, number];
export interface Options {
    cellWidth: number;
    cellHeight: number;
    roomWidth: [number, number];
    roomHeight: [number, number];
}
export interface Room {
    x: number;
    y: number;
    width: number;
    height: number;
    connections: any[];
    cellx: number;
    celly: number;
}
export default class Rogue extends Map {
    private _options;
    private map;
    private rooms;
    private connectedCells;
    constructor(width: number, height: number, options: Partial<Options>);
    create(callback?: CreateCallback): this;
    _calculateRoomSize(size: number, cell: number): [number, number];
    _initRooms(): void;
    _connectRooms(): void;
    _connectUnconnectedRooms(): void;
    _createRandomRoomConnections(): void;
    _createRooms(): void;
    _getWallPosition(aRoom: Room, aDirection: number): Point;
    _drawCorridor(startPosition: Point, endPosition: Point): void;
    _createCorridors(): void;
}
export {};
