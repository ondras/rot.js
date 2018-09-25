import Backend from "./backend.js";
import Hex from "./hex.js";
import Rect from "./rect.js";
import Tile from "./tile.js";
import { DisplayOptions, DisplayData } from "./types.js";
/**
 * @class Visual map display
 * @param {object} [options]
 * @param {int} [options.width=ROT.DEFAULT_WIDTH]
 * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
 * @param {int} [options.fontSize=15]
 * @param {string} [options.fontFamily="monospace"]
 * @param {string} [options.fontStyle=""] bold/italic/none/both
 * @param {string} [options.fg="#ccc"]
 * @param {string} [options.bg="#000"]
 * @param {float} [options.spacing=1]
 * @param {float} [options.border=0]
 * @param {string} [options.layout="rect"]
 * @param {bool} [options.forceSquareRatio=false]
 * @param {int} [options.tileWidth=32]
 * @param {int} [options.tileHeight=32]
 * @param {object} [options.tileMap={}]
 * @param {image} [options.tileSet=null]
 * @param {image} [options.tileColorize=false]
 */
export default class Display {
    _context: CanvasRenderingContext2D;
    _data: {
        [pos: string]: DisplayData;
    };
    _dirty: boolean | {
        [pos: string]: boolean;
    };
    _options: DisplayOptions;
    _backend: Backend;
    static Rect: typeof Rect;
    static Hex: typeof Hex;
    static Tile: typeof Tile;
    constructor(options?: Partial<DisplayOptions>);
    /**
     * Debug helper, ideal as a map generator callback. Always bound to this.
     * @param {int} x
     * @param {int} y
     * @param {int} what
     */
    DEBUG(x: number, y: number, what: number): void;
    /**
     * Clear the whole display (cover it with background color)
     */
    clear(): void;
    /**
     * @see ROT.Display
     */
    setOptions(options: Partial<DisplayOptions>): this;
    /**
     * Returns currently set options
     * @returns {object} Current options object
     */
    getOptions(): DisplayOptions;
    /**
     * Returns the DOM node of this display
     * @returns {node} DOM node
     */
    getContainer(): HTMLCanvasElement;
    /**
     * Compute the maximum width/height to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int[2]} cellWidth,cellHeight
     */
    computeSize(availWidth: number, availHeight: number): [number, number];
    /**
     * Compute the maximum font size to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int} fontSize
     */
    computeFontSize(availWidth: number, availHeight: number): number;
    computeTileSize(availWidth: number, availHeight: number): number[];
    /**
     * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
     * @param {Event} e event
     * @returns {int[2]} -1 for values outside of the canvas
     */
    eventToPosition(e: TouchEvent | MouseEvent): number[];
    /**
     * @param {int} x
     * @param {int} y
     * @param {string || string[]} ch One or more chars (will be overlapping themselves)
     * @param {string} [fg] foreground color
     * @param {string} [bg] background color
     */
    draw(x: number, y: number, ch: string | string[] | null, fg: string | null, bg: string | null): void;
    /**
     * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
     * @param {int} x
     * @param {int} y
     * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
     * @param {int} [maxWidth] wrap at what width?
     * @returns {int} lines drawn
     */
    drawText(x: number, y: number, text: string, maxWidth?: number): number;
    /**
     * Timer tick: update dirty parts
     */
    _tick(): void;
    /**
     * @param {string} key What to draw
     * @param {bool} clearBefore Is it necessary to clean before?
     */
    _draw(key: string, clearBefore: boolean): void;
}
