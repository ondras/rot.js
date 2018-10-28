import FOV, { VisibilityCallback } from "./fov.js";
export default class DiscreteShadowcasting extends FOV {
    compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    _visibleCoords(A: number, B: number, blocks: boolean, DATA: number[]): boolean;
}
