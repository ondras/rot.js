import Hex from "./hex.js";
import Rect from "./rect.js";
import Tile from "./tile.js";
import * as Text from "../text.js";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../constants.js";
const BACKENDS = {
    "hex": Hex,
    "rect": Rect,
    "tile": Tile
};
const DEFAULT_OPTIONS = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    transpose: false,
    layout: "rect",
    fontSize: 15,
    spacing: 1,
    border: 0,
    forceSquareRatio: false,
    fontFamily: "monospace",
    fontStyle: "",
    fg: "#ccc",
    bg: "#000",
    tileWidth: 32,
    tileHeight: 32,
    tileMap: {},
    tileSet: null,
    tileColorize: false,
    termColor: "xterm"
};
export default class Display {
    constructor(options = {}) {
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        this._data = {};
        this._dirty = false;
        this._options = {};
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.setOptions(options);
        this.DEBUG = this.DEBUG.bind(this);
        this._tick = this._tick.bind(this);
        requestAnimationFrame(this._tick);
    }
    DEBUG(x, y, what) {
        let colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
    }
    clear() {
        this._data = {};
        this._dirty = true;
    }
    setOptions(options) {
        Object.assign(this._options, options);
        if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
            if (options.layout) {
                let ctor = BACKENDS[options.layout];
                this._backend = new ctor(this._context);
            }
            let font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily;
            this._context.font = font;
            this._backend.compute(this._options);
            this._context.font = font;
            this._context.textAlign = "center";
            this._context.textBaseline = "middle";
            this._dirty = true;
        }
        return this;
    }
    getOptions() { return this._options; }
    getContainer() { return this._context.canvas; }
    computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
    }
    computeFontSize(availWidth, availHeight) {
        return this._backend.computeFontSize(availWidth, availHeight);
    }
    computeTileSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.width);
        let height = Math.floor(availHeight / this._options.height);
        return [width, height];
    }
    eventToPosition(e) {
        let x, y;
        if ("touches" in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        let rect = this._context.canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= this._context.canvas.width / rect.width;
        y *= this._context.canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= this._context.canvas.width || y >= this._context.canvas.height) {
            return [-1, -1];
        }
        return this._backend.eventToPosition(x, y);
    }
    draw(x, y, ch, fg, bg) {
        if (!fg) {
            fg = this._options.fg;
        }
        if (!bg) {
            bg = this._options.bg;
        }
        let key = `${x},${y}`;
        this._data[key] = [x, y, ch, fg, bg];
        if (this._dirty === true) {
            return;
        }
        if (!this._dirty) {
            this._dirty = {};
        }
        this._dirty[key] = true;
    }
    drawText(x, y, text, maxWidth) {
        let fg = null;
        let bg = null;
        let cx = x;
        let cy = y;
        let lines = 1;
        if (!maxWidth) {
            maxWidth = this._options.width - x;
        }
        let tokens = Text.tokenize(text, maxWidth);
        while (tokens.length) {
            let token = tokens.shift();
            switch (token.type) {
                case Text.TYPE_TEXT:
                    let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
                    for (let i = 0; i < token.value.length; i++) {
                        let cc = token.value.charCodeAt(i);
                        let c = token.value.charAt(i);
                        isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
                        isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
                        if (isPrevFullWidth && !isFullWidth && !isSpace) {
                            cx++;
                        }
                        if (isFullWidth && !isPrevSpace) {
                            cx++;
                        }
                        this.draw(cx++, cy, c, fg, bg);
                        isPrevSpace = isSpace;
                        isPrevFullWidth = isFullWidth;
                    }
                    break;
                case Text.TYPE_FG:
                    fg = token.value || null;
                    break;
                case Text.TYPE_BG:
                    bg = token.value || null;
                    break;
                case Text.TYPE_NEWLINE:
                    cx = x;
                    cy++;
                    lines++;
                    break;
            }
        }
        return lines;
    }
    _tick() {
        requestAnimationFrame(this._tick);
        if (!this._dirty) {
            return;
        }
        if (this._dirty === true) {
            this._context.fillStyle = this._options.bg;
            this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            for (let id in this._data) {
                this._draw(id, false);
            }
        }
        else {
            for (let key in this._dirty) {
                this._draw(key, true);
            }
        }
        this._dirty = false;
    }
    _draw(key, clearBefore) {
        let data = this._data[key];
        if (data[4] != this._options.bg) {
            clearBefore = true;
        }
        this._backend.draw(data, clearBefore);
    }
}
Display.Rect = Rect;
Display.Hex = Hex;
Display.Tile = Tile;
