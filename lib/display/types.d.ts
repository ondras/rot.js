declare type LayoutType = "hex" | "rect" | "tile" | "tile-gl" | "term";
export interface DisplayOptions {
    width: number;
    height: number;
    transpose: boolean;
    layout: LayoutType;
    fontSize: number;
    spacing: number;
    border: number;
    forceSquareRatio: boolean;
    fontFamily: string;
    fontStyle: string;
    fg: string;
    bg: string;
    tileWidth: number;
    tileHeight: number;
    tileMap: {
        [key: string]: [number, number];
    };
    tileSet: null | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap;
    tileColorize: Boolean;
}
export declare type DisplayData = [number, number, string | string[] | null, string, string];
export {};
