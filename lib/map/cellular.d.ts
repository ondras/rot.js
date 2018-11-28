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
export default class Cellular extends Map {
    _options: Options;
    _dirs: number[][];
    _map: number[][];
    constructor(width: number, height: number, options?: Partial<Options>);
    randomize(probability: number): this;
    setOptions(options: Partial<Options>): void;
    set(x: number, y: number, value: number): void;
    create(callback?: CreateCallback): void;
    _serviceCallback(callback: CreateCallback): void;
    _getNeighbors(cx: number, cy: number): number;
    connect(callback: CreateCallback, value: number, connectionCallback?: ConnectionCallback): void;
    _getFromTo(connected: PointMap, notConnected: PointMap): Point[];
    _getClosest(point: Point, space: PointMap): [number, number];
    _findConnected(connected: PointMap, notConnected: PointMap, stack: Point[], keepNotConnected: boolean, value: number): void;
    _tunnelToConnected(to: Point, from: Point, connected: PointMap, notConnected: PointMap, value: number, connectionCallback?: ConnectionCallback): void;
    _tunnelToConnected6(to: Point, from: Point, connected: PointMap, notConnected: PointMap, value: number, connectionCallback?: ConnectionCallback): void;
    _freeSpace(x: number, y: number, value: number): boolean;
    _pointKey(p: Point): string;
}
export {};
