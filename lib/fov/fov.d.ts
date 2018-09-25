export interface LightPassesCallback {
    (x: number, y: number): boolean;
}
export interface VisibilityCallback {
    (x: number, y: number, r: number, visibility: number): void;
}
export interface Options {
    topology: 4 | 6 | 8;
}
export default abstract class FOV {
    _lightPasses: LightPassesCallback;
    _options: Options;
    constructor(lightPassesCallback: LightPassesCallback, options?: Partial<Options>);
    abstract compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    _getCircle(cx: number, cy: number, r: number): number[][];
}
