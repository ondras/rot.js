/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
export declare function mod(x: number, n: number): number;
export declare function clamp(val: number, min?: number, max?: number): number;
export declare function capitalize(string: string): string;
/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
export declare function format(template: string, ...args: any[]): string;
