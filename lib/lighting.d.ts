import FOV from "fov/fov.js";
declare type LightColor = [number, number, number];
interface ReflectivityCallback {
    (x: number, y: number): number;
}
interface LightingCallback {
    (x: number, y: number, color: LightColor): void;
}
interface LightingMap {
    [key: string]: LightColor;
}
interface NumberMap {
    [key: string]: number;
}
interface Options {
    passes: number;
    emissionThreshold: number;
    range: 10;
}
export default class Lighting {
    _reflectivityCallback: ReflectivityCallback;
    _options: Options;
    _fov: FOV;
    _lights: LightingMap;
    _reflectivityCache: NumberMap;
    _fovCache: {
        [key: string]: NumberMap;
    };
    /**
     * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
     * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
     * @param {object} [options]
     * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a *highly simplified* radiosity-like algorithm.
     * @param {int} [options.emissionThreshold=100] Cells with emissivity > threshold will be treated as light source in the next pass.
     * @param {int} [options.range=10] Max light range
     */
    constructor(reflectivityCallback: ReflectivityCallback, options?: Partial<Options>);
    /**
     * Adjust options at runtime
     * @see ROT.Lighting
     * @param {object} [options]
     */
    setOptions(options: Partial<Options>): this;
    /**
     * Set the used Field-Of-View algo
     * @param {ROT.FOV} fov
     */
    setFOV(fov: FOV): this;
    /**
     * Set (or remove) a light source
     * @param {int} x
     * @param {int} y
     * @param {null || string || number[3]} color
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
     * @param {function} lightingCallback Will be called with (x, y, color) for every lit cell
     */
    compute(lightingCallback: LightingCallback): this;
    /**
     * Compute one iteration from all emitting cells
     * @param {object} emittingCells These emit light
     * @param {object} litCells Add projected light to these
     * @param {object} doneCells These already emitted, forbid them from further calculations
     */
    _emitLight(emittingCells: LightingMap, litCells: LightingMap, doneCells: {
        [key: string]: number;
    }): this;
    /**
     * Prepare a list of emitters for next pass
     * @param {object} litCells
     * @param {object} doneCells
     * @returns {object}
     */
    _computeEmitters(litCells: LightingMap, doneCells: {
        [key: string]: number;
    }): LightingMap;
    /**
     * Compute one iteration from one cell
     * @param {int} x
     * @param {int} y
     * @param {number[]} color
     * @param {object} litCells Cell data to by updated
     */
    _emitLightFromCell(x: number, y: number, color: LightColor, litCells: LightingMap): this;
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     * @param {int} x
     * @param {int} y
     * @returns {object}
     */
    _updateFOV(x: number, y: number): NumberMap;
}
export {};
