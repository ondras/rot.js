declare class RNG {
    _seed: number;
    _s0: number;
    _s1: number;
    _s2: number;
    _c: number;
    getSeed(): number;
    setSeed(seed: number): this;
    getUniform(): number;
    getUniformInt(lowerBound: number, upperBound: number): number;
    getNormal(mean?: number, stddev?: number): number;
    getPercentage(): number;
    getItem<T>(array: Array<T>): T | null;
    shuffle<T>(array: Array<T>): T[];
    getWeightedValue(data: {
        [key: string]: number;
        [key: number]: number;
    }): string | undefined;
    getState(): number[];
    setState(state: number[]): this;
    clone(): RNG;
}
declare const _default: RNG;
export default _default;
