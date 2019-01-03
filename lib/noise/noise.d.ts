/**
 * Base noise generator
 */
export default abstract class Noise {
    abstract get(x: number, y: number): number;
}
