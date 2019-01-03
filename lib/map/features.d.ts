interface RoomOptions {
    roomWidth: [number, number];
    roomHeight: [number, number];
}
interface CorridorOptions {
    corridorLength: [number, number];
}
interface FeatureOptions extends RoomOptions, CorridorOptions {
}
export interface FeatureConstructor {
    createRandomAt: (x: number, y: number, dx: number, dy: number, options: FeatureOptions) => Feature;
}
interface DigCallback {
    (x: number, y: number, value: number): void;
}
interface TestPositionCallback {
    (x: number, y: number): boolean;
}
/**
 * @class Dungeon feature; has own .create() method
 */
declare abstract class Feature {
    abstract isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback): boolean;
    abstract create(digCallback: DigCallback): void;
    abstract debug(): void;
}
/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
export declare class Room extends Feature {
    _x1: number;
    _y1: number;
    _x2: number;
    _y2: number;
    _doors: {
        [key: string]: number;
    };
    constructor(x1: number, y1: number, x2: number, y2: number, doorX?: number, doorY?: number);
    /**
     * Room of random size, with a given doors and direction
     */
    static createRandomAt(x: number, y: number, dx: number, dy: number, options: RoomOptions): Room;
    /**
     * Room of random size, positioned around center coords
     */
    static createRandomCenter(cx: number, cy: number, options: RoomOptions): Room;
    /**
     * Room of random size within a given dimensions
     */
    static createRandom(availWidth: number, availHeight: number, options: RoomOptions): Room;
    addDoor(x: number, y: number): this;
    /**
     * @param {function}
     */
    getDoors(cb: (x: number, y: number) => void): this;
    clearDoors(): this;
    addDoors(isWallCallback: TestPositionCallback): this;
    debug(): void;
    isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback): boolean;
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */
    create(digCallback: DigCallback): void;
    getCenter(): number[];
    getLeft(): number;
    getRight(): number;
    getTop(): number;
    getBottom(): number;
}
/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
export declare class Corridor extends Feature {
    _startX: number;
    _startY: number;
    _endX: number;
    _endY: number;
    _endsWithAWall: boolean;
    constructor(startX: number, startY: number, endX: number, endY: number);
    static createRandomAt(x: number, y: number, dx: number, dy: number, options: CorridorOptions): Corridor;
    debug(): void;
    isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback): boolean;
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    create(digCallback: DigCallback): boolean;
    createPriorityWalls(priorityWallCallback: (x: number, y: number) => void): void;
}
export {};
