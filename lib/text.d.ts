/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
export declare const TYPE_TEXT = 0;
export declare const TYPE_NEWLINE = 1;
export declare const TYPE_FG = 2;
export declare const TYPE_BG = 3;
/**
 * Measure size of a resulting text block
 */
export declare function measure(str: string, maxWidth: number): {
    width: number;
    height: number;
};
/**
 * Convert string to a series of a formatting commands
 */
export declare function tokenize(str: string, maxWidth: number): any[];
