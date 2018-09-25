import FOV, { VisibilityCallback } from "./fov.js";
/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
export default class DiscreteShadowcasting extends FOV {
    compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    /**
     * @param {int} A start angle
     * @param {int} B end angle
     * @param {bool} blocks Does current cell block visibility?
     * @param {int[][]} DATA shadowed angle pairs
     */
    _visibleCoords(A: number, B: number, blocks: boolean, DATA: number[]): boolean;
}
