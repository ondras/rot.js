import Backend from "./backend.js";
/**
 * @class Rectangular backend
 * @private
 */
export default class Rect extends Backend {
    constructor(context) {
        super(context);
        this._spacingX = 0;
        this._spacingY = 0;
        this._canvasCache = {};
    }
    compute(options) {
        super.compute(options);
        this._canvasCache = {};
        let charWidth = Math.ceil(this._context.measureText("W").width);
        this._spacingX = Math.ceil(options.spacing * charWidth);
        this._spacingY = Math.ceil(options.spacing * options.fontSize);
        if (this._options.forceSquareRatio) {
            this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
        }
        this._context.canvas.width = options.width * this._spacingX;
        this._context.canvas.height = options.height * this._spacingY;
    }
    draw(data, clearBefore) {
        if (Rect.cache) {
            this._drawWithCache(data, clearBefore);
        }
        else {
            this._drawNoCache(data, clearBefore);
        }
    }
    _drawWithCache(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let hash = "" + ch + fg + bg;
        let canvas;
        if (hash in this._canvasCache) {
            canvas = this._canvasCache[hash];
        }
        else {
            let b = this._options.border;
            canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = this._spacingX;
            canvas.height = this._spacingY;
            ctx.fillStyle = bg;
            ctx.fillRect(b, b, canvas.width - b, canvas.height - b);
            if (ch) {
                ctx.fillStyle = fg;
                ctx.font = this._context.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let chars = [].concat(ch);
                for (var i = 0; i < chars.length; i++) {
                    ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
                }
            }
            this._canvasCache[hash] = canvas;
        }
        this._context.drawImage(canvas, x * this._spacingX, y * this._spacingY);
    }
    _drawNoCache(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        if (clearBefore) {
            let b = this._options.border;
            this._context.fillStyle = bg;
            this._context.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
        }
        if (!ch) {
            return;
        }
        this._context.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._context.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._spacingX);
        let height = Math.floor(availHeight / this._spacingY);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        let boxWidth = Math.floor(availWidth / this._options.width);
        let boxHeight = Math.floor(availHeight / this._options.height);
        /* compute char ratio */
        let oldFont = this._context.font;
        this._context.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._context.measureText("W").width);
        this._context.font = oldFont;
        let ratio = width / 100;
        let widthFraction = ratio * boxHeight / boxWidth;
        if (widthFraction > 1) { /* too wide with current aspect ratio */
            boxHeight = Math.floor(boxHeight / widthFraction);
        }
        return Math.floor(boxHeight / this._options.spacing);
    }
    eventToPosition(x, y) {
        return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
    }
}
Rect.cache = false;
