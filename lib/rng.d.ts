/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
declare class RNG {
    _seed: number;
    _s0: number;
    _s1: number;
    _s2: number;
    _c: number;
    getSeed(): number;
    /**
     * @param {number} seed Seed the number generator
     */
    setSeed(seed: number): this;
    /**
     * @returns {float} Pseudorandom value [0,1), uniformly distributed
     */
    getUniform(): number;
    /**
     * @param {int} lowerBound The lower end of the range to return a value from, inclusive
     * @param {int} upperBound The upper end of the range to return a value from, inclusive
     * @returns {int} Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    getUniformInt(lowerBound: number, upperBound: number): number;
    /**
     * @param {float} [mean=0] Mean value
     * @param {float} [stddev=1] Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns {float} A normally distributed pseudorandom value
     */
    getNormal(mean: number, stddev: number): number;
    /**
     * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    getPercentage(): number;
    /**
     * @returns {any} Randomly picked item, null when length=0
     */
    getItem<T>(array: Array<T>): T | null;
    /**
     * @returns {array} New array with randomized items
     */
    shuffle<T>(array: Array<T>): T[];
    /**
     * @param {object} data key=whatever, value=weight (relative probability)
     * @returns {string} whatever
     */
    getWeightedValue(data: any): string | undefined;
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns {?} Internal state
     */
    getState(): number[];
    /**
     * Set a previously retrieved state.
     * @param {?} state
     */
    setState(state: number[]): this;
    /**
     * Returns a cloned RNG
     */
    clone(): RNG;
}
declare const _default: RNG;
export default _default;
