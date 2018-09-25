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
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    constructor(lightPassesCallback: LightPassesCallback, options?: Partial<Options>);
    /**
     * Compute visibility for a 360-degree circle
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    abstract compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */
    _getCircle(cx: number, cy: number, r: number): number[][];
}
