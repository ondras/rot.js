export declare type Color = [number, number, number];
export declare function fromString(str: string): Color;
/**
 * Add two or more colors
 */
export declare function add(color1: Color, ...colors: Color[]): Color;
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 */
export declare function add_(color1: Color, ...colors: Color[]): Color;
/**
 * Multiply (mix) two or more colors
 */
export declare function multiply(color1: Color, ...colors: Color[]): Color;
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 */
export declare function multiply_(color1: Color, ...colors: Color[]): Color;
/**
 * Interpolate (blend) two colors with a given factor
 */
export declare function interpolate(color1: Color, color2: Color, factor?: number): Color;
export declare const lerp: typeof interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 */
export declare function interpolateHSL(color1: Color, color2: Color, factor?: number): Color;
export declare const lerpHSL: typeof interpolateHSL;
/**
 * Create a new random color based on this one
 * @param color
 * @param diff Set of standard deviations
 */
export declare function randomize(color: Color, diff: number | Color): Color;
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 */
export declare function rgb2hsl(color: Color): Color;
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 */
export declare function hsl2rgb(color: Color): Color;
export declare function toRGB(color: Color): string;
export declare function toHex(color: Color): string;
