/**
 * @namespace Color operations
 */
declare type Color = [number, number, number];
export declare function fromString(str: string): number[];
/**
 * Add two or more colors
 * @param {number[]} color1
 * @param {number[]} color2
 * @returns {number[]}
 */
export declare function add(color1: Color, ...colors: Color[]): number[];
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 * @param {number[]} color1
 * @param {number[]} color2
 * @returns {number[]}
 */
export declare function add_(color1: Color, ...colors: Color[]): [number, number, number];
/**
 * Multiply (mix) two or more colors
 * @param {number[]} color1
 * @param {number[]} color2
 * @returns {number[]}
 */
export declare function multiply(color1: Color, ...colors: Color[]): number[];
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 * @param {number[]} color1
 * @param {number[]} color2
 * @returns {number[]}
 */
export declare function multiply_(color1: Color, ...colors: Color[]): [number, number, number];
/**
 * Interpolate (blend) two colors with a given factor
 * @param {number[]} color1
 * @param {number[]} color2
 * @param {float} [factor=0.5] 0..1
 * @returns {number[]}
 */
export declare function interpolate(color1: Color, color2: Color, factor?: number): number[];
export declare const lerp: typeof interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 * @param {number[]} color1
 * @param {number[]} color2
 * @param {float} [factor=0.5] 0..1
 * @returns {number[]}
 */
export declare function interpolateHSL(color1: Color, color2: Color, factor?: number): number[];
export declare const lerpHSL: typeof interpolateHSL;
/**
 * Create a new random color based on this one
 * @param {number[]} color
 * @param {number[]} diff Set of standard deviations
 * @returns {number[]}
 */
export declare function randomize(color: Color, diff: number | number[]): number[];
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 * @param {number[]} color
 * @returns {number[]}
 */
export declare function rgb2hsl(color: Color): Color;
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 * @param {number[]} color
 * @returns {number[]}
 */
export declare function hsl2rgb(color: Color): number[];
export declare function toRGB(color: Color): string;
export declare function toHex(color: Color): string;
export {};
