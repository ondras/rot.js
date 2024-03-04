import { CreateCallback } from "./map.js";
import Dungeon from "./dungeon.js";
interface Options {
    roomWidth: [number, number];
    roomHeight: [number, number];
    corridorLength: [number, number];
    dugPercentage: number;
    timeLimit: number;
}
/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://roguebasin.com/index.php/Dungeon-Building_Algorithm
 */
export default class Digger extends Dungeon {
    _options: Options;
    _featureAttempts: number;
    _map: number[][];
    _walls: {
        [key: string]: number;
    };
    _dug: number;
    _features: {
        [key: string]: number;
    };
    constructor(width: number, height: number, options?: Partial<Options>);
    create(callback?: CreateCallback): this;
    _digCallback(x: number, y: number, value: number): void;
    _isWallCallback(x: number, y: number): boolean;
    _canBeDugCallback(x: number, y: number): boolean;
    _priorityWallCallback(x: number, y: number): void;
    _firstRoom(): void;
    /**
     * Get a suitable wall
     */
    _findWall(): string | null;
    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */
    _tryFeature(x: number, y: number, dx: number, dy: number): boolean;
    _removeSurroundingWalls(cx: number, cy: number): void;
    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */
    _getDiggingDirection(cx: number, cy: number): number[] | null;
    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */
    _addDoors(): void;
}
export {};
