import FOV, { VisibilityCallback } from "./fov.js";
declare type Arc = [number, number];
/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
export default class PreciseShadowcasting extends FOV {
    compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    /**
     * @param {int[2]} A1 arc start
     * @param {int[2]} A2 arc end
     * @param {bool} blocks Does current arc block visibility?
     * @param {int[][]} SHADOWS list of active shadows
     */
    _checkVisibility(A1: Arc, A2: Arc, blocks: boolean, SHADOWS: Arc[]): number;
}
export {};
