import Noise from "./noise.js";
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */
export default class Simplex extends Noise {
    _gradients: number[][];
    _indexes: number[];
    _perms: number[];
    /**
     * @param gradients Random gradients
     */
    constructor(gradients?: number);
    get(xin: number, yin: number): number;
}
