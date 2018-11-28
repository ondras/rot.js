import { CreateCallback } from "./map.js";
import Dungeon from "./dungeon.js";
interface Options {
    roomWidth: [number, number];
    roomHeight: [number, number];
    corridorLength: [number, number];
    dugPercentage: number;
    timeLimit: number;
}
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
    _findWall(): string | null;
    _tryFeature(x: number, y: number, dx: number, dy: number): boolean;
    _removeSurroundingWalls(cx: number, cy: number): void;
    _getDiggingDirection(cx: number, cy: number): number[] | null;
    _addDoors(): void;
}
export {};
