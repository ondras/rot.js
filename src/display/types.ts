type LayoutType = "hex" | "rect" | "tile" | "term";

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
	tileMap: { [key: string]: [number, number] };
	tileSet: null | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap;
	tileColorize: Boolean;
}

export type DisplayData = [number, number, string | string[] | null, string, string];
