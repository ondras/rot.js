import Backend from "./backend.js";
import { DisplayOptions, DisplayData } from "./types.js";
/**
 * @class Tile backend
 * @private
 */
export default class TileGL extends Backend {
    _gl: WebGLRenderingContext;
    _program: WebGLProgram;
    _uniforms: {
        [key: string]: WebGLUniformLocation | null;
    };
    static isSupported(): boolean;
    constructor();
    schedule(cb: () => void): void;
    getContainer(): HTMLCanvasElement;
    setOptions(opts: DisplayOptions): void;
    draw(data: DisplayData, clearBefore: boolean): void;
    clear(): void;
    computeSize(availWidth: number, availHeight: number): [number, number];
    computeFontSize(): number;
    eventToPosition(x: number, y: number): [number, number];
    _initWebGL(): WebGLRenderingContext;
    _normalizedEventToPosition(x: number, y: number): [number, number];
    _updateSize(): void;
    _updateTexture(tileSet: HTMLImageElement): void;
}
