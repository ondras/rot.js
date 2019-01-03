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
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
export default class Uniform extends Dungeon {
    _options: Options;
    _roomAttempts: number;
    _corridorAttempts: number;
    _connected: Room[];
    _unconnected: Room[];
    _map: number[][];
    _dug: number;
    constructor(width: number, height: number, options: Partial<Options>);
    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */
    create(callback?: CreateCallback): this | null;
    /**
     * Generates a suitable amount of rooms
     */
    _generateRooms(): void;
    /**
     * Try to generate one room
     */
    _generateRoom(): Room | null;
    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */
    _generateCorridors(): boolean;
    /**
     * For a given room, find the closest one from the list
     */
    _closestRoom(rooms: Room[], room: Room): Room | null;
    _connectRooms(room1: Room, room2: Room): boolean;
    _placeInWall(room: Room, dirIndex: number): Point | null;
    /**
     * Dig a polyline.
     */
    _digLine(points: Point[]): void;
    _digCallback(x: number, y: number, value: number): void;
    _isWallCallback(x: number, y: number): boolean;
    _canBeDugCallback(x: number, y: number): boolean;
}
export {};
