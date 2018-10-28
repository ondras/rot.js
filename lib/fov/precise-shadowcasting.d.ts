import FOV, { VisibilityCallback } from "./fov.js";
declare type Arc = [number, number];
export default class PreciseShadowcasting extends FOV {
    compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    _checkVisibility(A1: Arc, A2: Arc, blocks: boolean, SHADOWS: Arc[]): number;
}
export {};
