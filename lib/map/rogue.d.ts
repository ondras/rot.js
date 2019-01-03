import Map, { CreateCallback } from "./map.js";
declare type Point = [number, number];
export interface Options {
    /** Number of cells to create on the horizontal (number of rooms horizontally) */
    cellWidth: number;
    /** Number of cells to create on the vertical (number of rooms vertically) */
    cellHeight: number;
    /** Room min and max width - normally set auto-magically via the constructor. */
    roomWidth: [number, number];
    /** Room min and max height - normally set auto-magically via the constructor. */
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
/**
 * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @author hyakugei
 */
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
