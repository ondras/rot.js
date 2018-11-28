export interface CreateCallback {
    (x: number, y: number, contents: number): any;
}
export default abstract class Map {
    _width: number;
    _height: number;
    constructor(width?: number, height?: number);
    abstract create(callback?: CreateCallback): void;
    _fillMap(value: number): number[][];
}
