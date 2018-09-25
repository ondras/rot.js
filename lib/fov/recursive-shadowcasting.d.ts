import FOV, { VisibilityCallback } from "./fov.js";
export default class RecursiveShadowcasting extends FOV {
    compute(x: number, y: number, R: number, callback: VisibilityCallback): void;
    compute180(x: number, y: number, R: number, dir: number, callback: VisibilityCallback): void;
    compute90(x: number, y: number, R: number, dir: number, callback: VisibilityCallback): void;
    _renderOctant(x: number, y: number, octant: number[], R: number, callback: VisibilityCallback): void;
    _castVisibility(startX: number, startY: number, row: number, visSlopeStart: number, visSlopeEnd: number, radius: number, xx: number, xy: number, yx: number, yy: number, callback: VisibilityCallback): void;
}
