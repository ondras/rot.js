import Noise from "./noise.js";
export default class Simplex extends Noise {
    _gradients: number[][];
    _indexes: number[];
    _perms: number[];
    constructor(gradients?: number);
    get(xin: number, yin: number): number;
}
