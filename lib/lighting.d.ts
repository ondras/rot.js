import FOV from "./fov/fov.js";
declare type LightColor = [number, number, number];
/** Callback to retrieve cell reflectivity (0..1) */
interface ReflectivityCallback {
    (x: number, y: number): number;
}
/** Will be called for every lit cell */
interface LightingCallback {
    (x: number, y: number, color: LightColor): void;
}
interface Options {
    /** Number of passes. 1 equals to simple FOV of all light sources, >1 means a *highly simplified* radiosity-like algorithm. Default = 1 */
    passes: number;
    /** Cells with emissivity > threshold will be treated as light source in the next pass. Default = 100 */
    emissionThreshold: number;
    /** Max light range, default = 10 */
    range: number;
}
/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
export default class Lighting {
    private _reflectivityCallback;
    private _options;
    private _fov;
    private _lights;
    private _reflectivityCache;
    private _fovCache;
    constructor(reflectivityCallback: ReflectivityCallback, options?: Partial<Options>);
    /**
     * Adjust options at runtime
     */
    setOptions(options: Partial<Options>): this;
    /**
     * Set the used Field-Of-View algo
     */
    setFOV(fov: FOV): this;
    /**
     * Set (or remove) a light source
     */
    setLight(x: number, y: number, color: null | string | LightColor): this;
    /**
     * Remove all light sources
     */
    clearLights(): void;
    /**
     * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
     */
    reset(): this;
    /**
     * Compute the lighting
     */
    compute(lightingCallback: LightingCallback): this;
    /**
     * Compute one iteration from all emitting cells
     * @param emittingCells These emit light
     * @param litCells Add projected light to these
     * @param doneCells These already emitted, forbid them from further calculations
     */
    private _emitLight;
    /**
     * Prepare a list of emitters for next pass
     */
    private _computeEmitters;
    /**
     * Compute one iteration from one cell
     */
    private _emitLightFromCell;
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     */
    private _updateFOV;
}
export {};
