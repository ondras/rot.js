import FOV from "fov/fov.js";
declare type LightColor = [number, number, number];
interface ReflectivityCallback {
    (x: number, y: number): number;
}
interface LightingCallback {
    (x: number, y: number, color: LightColor): void;
}
interface Options {
    passes: number;
    emissionThreshold: number;
    range: number;
}
export default class Lighting {
    private _reflectivityCallback;
    private _options;
    private _fov;
    private _lights;
    private _reflectivityCache;
    private _fovCache;
    constructor(reflectivityCallback: ReflectivityCallback, options?: Partial<Options>);
    setOptions(options: Partial<Options>): this;
    setFOV(fov: FOV): this;
    setLight(x: number, y: number, color: null | string | LightColor): this;
    clearLights(): void;
    reset(): this;
    compute(lightingCallback: LightingCallback): this;
    private _emitLight;
    private _computeEmitters;
    private _emitLightFromCell;
    private _updateFOV;
}
export {};
