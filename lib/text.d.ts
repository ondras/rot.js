export declare const TYPE_TEXT = 0;
export declare const TYPE_NEWLINE = 1;
export declare const TYPE_FG = 2;
export declare const TYPE_BG = 3;
export declare function measure(str: string, maxWidth: number): {
    width: number;
    height: number;
};
export declare function tokenize(str: string, maxWidth: number): any[];
