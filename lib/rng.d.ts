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
     * Seed the number generator
     */
    setSeed(seed: number): this;
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    getUniform(): number;
    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    getUniformInt(lowerBound: number, upperBound: number): number;
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */
    getNormal(mean?: number, stddev?: number): number;
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    getPercentage(): number;
    /**
     * @returns Randomly picked item, null when length=0
     */
    getItem<T>(array: Array<T>): T | null;
    /**
     * @returns New array with randomized items
     */
    shuffle<T>(array: Array<T>): T[];
    /**
     * @param data key=whatever, value=weight (relative probability)
     * @returns whatever
     */
    getWeightedValue(data: {
        [key: string]: number;
        [key: number]: number;
    }): string | undefined;
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */
    getState(): number[];
    /**
     * Set a previously retrieved state.
     */
    setState(state: number[]): this;
    /**
     * Returns a cloned RNG
     */
    clone(): RNG;
}
declare const _default: RNG;
export default _default;
