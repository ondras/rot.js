import Map, { CreateCallback } from "./map.js";
interface Options {
    born: number[];
    survive: number[];
    topology: 4 | 6 | 8;
}
interface ConnectionCallback {
    (from: Point, to: Point): void;
}
declare type Point = [number, number];
declare type PointMap = {
    [key: string]: Point;
};
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
export default class Cellular extends Map {
    _options: Options;
    _dirs: number[][];
    _map: number[][];
    constructor(width: number, height: number, options?: Partial<Options>);
    /**
     * Fill the map with random values
     * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
     */
    randomize(probability: number): this;
    /**
     * Change options.
     * @see ROT.Map.Cellular
     */
    setOptions(options: Partial<Options>): void;
    set(x: number, y: number, value: number): void;
    create(callback?: CreateCallback): void;
    _serviceCallback(callback: CreateCallback): void;
    /**
     * Get neighbor count at [i,j] in this._map
     */
    _getNeighbors(cx: number, cy: number): number;
    /**
     * Make sure every non-wall space is accessible.
     * @param {function} callback to call to display map when do
     * @param {int} value to consider empty space - defaults to 0
     * @param {function} callback to call when a new connection is made
     */
    connect(callback: CreateCallback, value: number, connectionCallback?: ConnectionCallback): void;
    /**
     * Find random points to connect. Search for the closest point in the larger space.
     * This is to minimize the length of the passage while maintaining good performance.
     */
    _getFromTo(connected: PointMap, notConnected: PointMap): Point[];
    _getClosest(point: Point, space: PointMap): Point;
    _findConnected(connected: PointMap, notConnected: PointMap, stack: Point[], keepNotConnected: boolean, value: number): void;
    _tunnelToConnected(to: Point, from: Point, connected: PointMap, notConnected: PointMap, value: number, connectionCallback?: ConnectionCallback): void;
    _tunnelToConnected6(to: Point, from: Point, connected: PointMap, notConnected: PointMap, value: number, connectionCallback?: ConnectionCallback): void;
    _freeSpace(x: number, y: number, value: number): boolean;
    _pointKey(p: Point): string;
}
export {};
