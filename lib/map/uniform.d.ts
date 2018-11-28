import { CreateCallback } from "./map.js";
import Dungeon from "./dungeon.js";
import { Room } from "./features.js";
interface Options {
    roomWidth: [number, number];
    roomHeight: [number, number];
    roomDugPercentage: number;
    timeLimit: number;
}
declare type Point = [number, number];
export default class Uniform extends Dungeon {
    _options: Options;
    _roomAttempts: number;
    _corridorAttempts: number;
    _connected: Room[];
    _unconnected: Room[];
    _map: number[][];
    _dug: number;
    constructor(width: number, height: number, options: Partial<Options>);
    create(callback?: CreateCallback): this | null;
    _generateRooms(): void;
    _generateRoom(): Room | null;
    _generateCorridors(): boolean;
    _closestRoom(rooms: Room[], room: Room): Room | null;
    _connectRooms(room1: Room, room2: Room): boolean;
    _placeInWall(room: Room, dirIndex: number): Point | null;
    _digLine(points: Point[]): void;
    _digCallback(x: number, y: number, value: number): void;
    _isWallCallback(x: number, y: number): boolean;
    _canBeDugCallback(x: number, y: number): boolean;
}
export {};
