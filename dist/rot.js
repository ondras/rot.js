var ROT = (function (exports) {
    'use strict';

    /**
     * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
     * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
     */
    const FRAC = 2.3283064365386963e-10; /* 2^-32 */
    class RNG {
        constructor() {
            this._seed = 0;
            this._s0 = 0;
            this._s1 = 0;
            this._s2 = 0;
            this._c = 0;
        }
        getSeed() { return this._seed; }
        /**
         * @param {number} seed Seed the number generator
         */
        setSeed(seed) {
            seed = (seed < 1 ? 1 / seed : seed);
            this._seed = seed;
            this._s0 = (seed >>> 0) * FRAC;
            seed = (seed * 69069 + 1) >>> 0;
            this._s1 = seed * FRAC;
            seed = (seed * 69069 + 1) >>> 0;
            this._s2 = seed * FRAC;
            this._c = 1;
            return this;
        }
        /**
         * @returns {float} Pseudorandom value [0,1), uniformly distributed
         */
        getUniform() {
            let t = 2091639 * this._s0 + this._c * FRAC;
            this._s0 = this._s1;
            this._s1 = this._s2;
            this._c = t | 0;
            this._s2 = t - this._c;
            return this._s2;
        }
        /**
         * @param {int} lowerBound The lower end of the range to return a value from, inclusive
         * @param {int} upperBound The upper end of the range to return a value from, inclusive
         * @returns {int} Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
         */
        getUniformInt(lowerBound, upperBound) {
            let max = Math.max(lowerBound, upperBound);
            let min = Math.min(lowerBound, upperBound);
            return Math.floor(this.getUniform() * (max - min + 1)) + min;
        }
        /**
         * @param {float} [mean=0] Mean value
         * @param {float} [stddev=1] Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
         * @returns {float} A normally distributed pseudorandom value
         */
        getNormal(mean, stddev) {
            let u, v, r;
            do {
                u = 2 * this.getUniform() - 1;
                v = 2 * this.getUniform() - 1;
                r = u * u + v * v;
            } while (r > 1 || r == 0);
            let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
            return (mean || 0) + gauss * (stddev || 1);
        }
        /**
         * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
         */
        getPercentage() {
            return 1 + Math.floor(this.getUniform() * 100);
        }
        /**
         * @param {object} data key=whatever, value=weight (relative probability)
         * @returns {string} whatever
         */
        getWeightedValue(data) {
            let total = 0;
            for (let id in data) {
                total += data[id];
            }
            let random = this.getUniform() * total;
            let id, part = 0;
            for (id in data) {
                part += data[id];
                if (random < part) {
                    return id;
                }
            }
            // If by some floating-point annoyance we have
            // random >= total, just return the last id.
            return id;
        }
        /**
         * Get RNG state. Useful for storing the state and re-setting it via setState.
         * @returns {?} Internal state
         */
        getState() { return [this._s0, this._s1, this._s2, this._c]; }
        /**
         * Set a previously retrieved state.
         * @param {?} state
         */
        setState(state) {
            this._s0 = state[0];
            this._s1 = state[1];
            this._s2 = state[2];
            this._c = state[3];
            return this;
        }
        /**
         * Returns a cloned RNG
         */
        clone() {
            let clone = new RNG();
            return clone.setState(this.getState());
        }
    }
    var rng = new RNG().setSeed(Date.now());

    /**
     * @class Abstract display backend module
     * @private
     */
    class Backend {
        constructor(context) { this._context = context; }
        compute(options) { this._options = options; }
        draw(data, clearBefore) { }
        computeSize(availWidth, availHeight) { }
        computeFontSize(availWidth, availHeight) { }
        eventToPosition(x, y) { }
    }

    /**
     * Always positive modulus
     * @param x Operand
     * @param n Modulus
     * @returns x modulo n
     */
    function mod(x, n) {
        return (x % n + n) % n;
    }
    function clamp(val, min = 0, max = 1) {
        if (val < min)
            return min;
        if (val > max)
            return max;
        return val;
    }

    /**
     * @class Hexagonal backend
     * @private
     */
    class Hex extends Backend {
        constructor(context) {
            super(context);
            this._spacingX = 0;
            this._spacingY = 0;
            this._hexSize = 0;
        }
        compute(options) {
            super.compute(options);
            /* FIXME char size computation does not respect transposed hexes */
            let charWidth = Math.ceil(this._context.measureText("W").width);
            this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth / Math.sqrt(3)) / 2);
            this._spacingX = this._hexSize * Math.sqrt(3) / 2;
            this._spacingY = this._hexSize * 1.5;
            let xprop;
            let yprop;
            if (options.transpose) {
                xprop = "height";
                yprop = "width";
            }
            else {
                xprop = "width";
                yprop = "height";
            }
            this._context.canvas[xprop] = Math.ceil((options.width + 1) * this._spacingX);
            this._context.canvas[yprop] = Math.ceil((options.height - 1) * this._spacingY + 2 * this._hexSize);
        }
        draw(data, clearBefore) {
            let [x, y, ch, fg, bg] = data;
            let px = [
                (x + 1) * this._spacingX,
                y * this._spacingY + this._hexSize
            ];
            if (this._options.transpose) {
                px.reverse();
            }
            if (clearBefore) {
                this._context.fillStyle = bg;
                this._fill(px[0], px[1]);
            }
            if (!ch) {
                return;
            }
            this._context.fillStyle = fg;
            let chars = [].concat(ch);
            for (let i = 0; i < chars.length; i++) {
                this._context.fillText(chars[i], px[0], Math.ceil(px[1]));
            }
        }
        computeSize(availWidth, availHeight) {
            if (this._options.transpose) {
                availWidth += availHeight;
                availHeight = availWidth - availHeight;
                availWidth -= availHeight;
            }
            let width = Math.floor(availWidth / this._spacingX) - 1;
            let height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
            return [width, height];
        }
        computeFontSize(availWidth, availHeight) {
            if (this._options.transpose) {
                availWidth += availHeight;
                availHeight = availWidth - availHeight;
                availWidth -= availHeight;
            }
            let hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
            let hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
            let hexSize = Math.min(hexSizeWidth, hexSizeHeight);
            /* compute char ratio */
            let oldFont = this._context.font;
            this._context.font = "100px " + this._options.fontFamily;
            let width = Math.ceil(this._context.measureText("W").width);
            this._context.font = oldFont;
            let ratio = width / 100;
            hexSize = Math.floor(hexSize) + 1; /* closest larger hexSize */
            /* FIXME char size computation does not respect transposed hexes */
            let fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
            /* closest smaller fontSize */
            return Math.ceil(fontSize) - 1;
        }
        eventToPosition(x, y) {
            let nodeSize;
            if (this._options.transpose) {
                x += y;
                y = x - y;
                x -= y;
                nodeSize = this._context.canvas.width;
            }
            else {
                nodeSize = this._context.canvas.height;
            }
            let size = nodeSize / this._options.height;
            y = Math.floor(y / size);
            if (mod(y, 2)) { /* odd row */
                x -= this._spacingX;
                x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
            }
            else {
                x = 2 * Math.floor(x / (2 * this._spacingX));
            }
            return [x, y];
        }
        /**
         * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
         */
        _fill(cx, cy) {
            let a = this._hexSize;
            let b = this._options.border;
            this._context.beginPath();
            if (this._options.transpose) {
                this._context.moveTo(cx - a + b, cy);
                this._context.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
                this._context.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
                this._context.lineTo(cx + a - b, cy);
                this._context.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
                this._context.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
                this._context.lineTo(cx - a + b, cy);
            }
            else {
                this._context.moveTo(cx, cy - a + b);
                this._context.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
                this._context.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
                this._context.lineTo(cx, cy + a - b);
                this._context.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
                this._context.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
                this._context.lineTo(cx, cy - a + b);
            }
            this._context.fill();
        }
    }

    /**
     * @class Rectangular backend
     * @private
     */
    class Rect extends Backend {
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

    /**
     * @class Tile backend
     * @private
     */
    class Tile extends Backend {
        constructor(context) {
            super(context);
            this._colorCanvas = document.createElement("canvas");
        }
        compute(options) {
            super.compute(options);
            this._context.canvas.width = options.width * options.tileWidth;
            this._context.canvas.height = options.height * options.tileHeight;
            this._colorCanvas.width = options.tileWidth;
            this._colorCanvas.height = options.tileHeight;
        }
        draw(data, clearBefore) {
            let [x, y, ch, fg, bg] = data;
            let tileWidth = this._options.tileWidth;
            let tileHeight = this._options.tileHeight;
            if (clearBefore) {
                if (this._options.tileColorize) {
                    this._context.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
                else {
                    this._context.fillStyle = bg;
                    this._context.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
            }
            if (!ch) {
                return;
            }
            let chars = [].concat(ch);
            let fgs = [].concat(fg);
            let bgs = [].concat(bg);
            for (let i = 0; i < chars.length; i++) {
                let tile = this._options.tileMap[chars[i]];
                if (!tile) {
                    throw new Error("Char '" + chars[i] + "' not found in tileMap");
                }
                if (this._options.tileColorize) { /* apply colorization */
                    let canvas = this._colorCanvas;
                    let context = canvas.getContext("2d");
                    context.globalCompositeOperation = "source-over";
                    context.clearRect(0, 0, tileWidth, tileHeight);
                    let fg = fgs[i];
                    let bg = bgs[i];
                    context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                    if (fg != "transparent") {
                        context.fillStyle = fg;
                        context.globalCompositeOperation = "source-atop";
                        context.fillRect(0, 0, tileWidth, tileHeight);
                    }
                    if (bg != "transparent") {
                        context.fillStyle = bg;
                        context.globalCompositeOperation = "destination-over";
                        context.fillRect(0, 0, tileWidth, tileHeight);
                    }
                    this._context.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
                else { /* no colorizing, easy */
                    this._context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
            }
        }
        computeSize(availWidth, availHeight) {
            let width = Math.floor(availWidth / this._options.tileWidth);
            let height = Math.floor(availHeight / this._options.tileHeight);
            return [width, height];
        }
        computeFontSize(availWidth, availHeight) {
            let width = Math.floor(availWidth / this._options.width);
            let height = Math.floor(availHeight / this._options.height);
            return [width, height];
        }
        eventToPosition(x, y) {
            return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
        }
    }

    /**
     * @namespace
     * Contains text tokenization and breaking routines
     */
    const RE_COLORS = /%([bc]){([^}]*)}/g;
    // token types
    const TYPE_TEXT = 0;
    const TYPE_NEWLINE = 1;
    const TYPE_FG = 2;
    const TYPE_BG = 3;
    /**
     * Convert string to a series of a formatting commands
     */
    function tokenize(str, maxWidth) {
        let result = [];
        /* first tokenization pass - split texts and color formatting commands */
        let offset = 0;
        str.replace(RE_COLORS, function (match, type, name, index) {
            /* string before */
            let part = str.substring(offset, index);
            if (part.length) {
                result.push({
                    type: TYPE_TEXT,
                    value: part
                });
            }
            /* color command */
            result.push({
                type: (type == "c" ? TYPE_FG : TYPE_BG),
                value: name.trim()
            });
            offset = index + match.length;
            return "";
        });
        /* last remaining part */
        let part = str.substring(offset);
        if (part.length) {
            result.push({
                type: TYPE_TEXT,
                value: part
            });
        }
        return breakLines(result, maxWidth);
    }
    /* insert line breaks into first-pass tokenized data */
    function breakLines(tokens, maxWidth) {
        if (!maxWidth) {
            maxWidth = Infinity;
        }
        let i = 0;
        let lineLength = 0;
        let lastTokenWithSpace = -1;
        while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
            let token = tokens[i];
            if (token.type == TYPE_NEWLINE) { /* reset */
                lineLength = 0;
                lastTokenWithSpace = -1;
            }
            if (token.type != TYPE_TEXT) { /* skip non-text tokens */
                i++;
                continue;
            }
            /* remove spaces at the beginning of line */
            while (lineLength == 0 && token.value.charAt(0) == " ") {
                token.value = token.value.substring(1);
            }
            /* forced newline? insert two new tokens after this one */
            let index = token.value.indexOf("\n");
            if (index != -1) {
                token.value = breakInsideToken(tokens, i, index, true);
                /* if there are spaces at the end, we must remove them (we do not want the line too long) */
                let arr = token.value.split("");
                while (arr.length && arr[arr.length - 1] == " ") {
                    arr.pop();
                }
                token.value = arr.join("");
            }
            /* token degenerated? */
            if (!token.value.length) {
                tokens.splice(i, 1);
                continue;
            }
            if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */
                /* is it possible to break within this token? */
                let index = -1;
                while (1) {
                    let nextIndex = token.value.indexOf(" ", index + 1);
                    if (nextIndex == -1) {
                        break;
                    }
                    if (lineLength + nextIndex > maxWidth) {
                        break;
                    }
                    index = nextIndex;
                }
                if (index != -1) { /* break at space within this one */
                    token.value = breakInsideToken(tokens, i, index, true);
                }
                else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
                    let token = tokens[lastTokenWithSpace];
                    let breakIndex = token.value.lastIndexOf(" ");
                    token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
                    i = lastTokenWithSpace;
                }
                else { /* force break in this token */
                    token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
                }
            }
            else { /* line not long, continue */
                lineLength += token.value.length;
                if (token.value.indexOf(" ") != -1) {
                    lastTokenWithSpace = i;
                }
            }
            i++; /* advance to next token */
        }
        tokens.push({ type: TYPE_NEWLINE }); /* insert fake newline to fix the last text line */
        /* remove trailing space from text tokens before newlines */
        let lastTextToken = null;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            switch (token.type) {
                case TYPE_TEXT:
                    lastTextToken = token;
                    break;
                case TYPE_NEWLINE:
                    if (lastTextToken) { /* remove trailing space */
                        let arr = lastTextToken.value.split("");
                        while (arr.length && arr[arr.length - 1] == " ") {
                            arr.pop();
                        }
                        lastTextToken.value = arr.join("");
                    }
                    lastTextToken = null;
                    break;
            }
        }
        tokens.pop(); /* remove fake token */
        return tokens;
    }
    /**
     * Create new tokens and insert them into the stream
     * @param {object[]} tokens
     * @param {int} tokenIndex Token being processed
     * @param {int} breakIndex Index within current token's value
     * @param {bool} removeBreakChar Do we want to remove the breaking character?
     * @returns {string} remaining unbroken token value
     */
    function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
        let newBreakToken = {
            type: TYPE_NEWLINE
        };
        let newTextToken = {
            type: TYPE_TEXT,
            value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
        };
        tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
        return tokens[tokenIndex].value.substring(0, breakIndex);
    }

    /** Default with for display and map generators */
    let DEFAULT_WIDTH = 80;
    /** Default height for display and map generators */
    let DEFAULT_HEIGHT = 25;

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
    class Display {
        constructor(options = {}) {
            let canvas = document.createElement("canvas");
            this._context = canvas.getContext("2d");
            this._data = {};
            this._dirty = false; // false = nothing, true = all, object = dirty cells
            this._options = {};
            options = Object.assign({}, DEFAULT_OPTIONS, options);
            this.setOptions(options);
            this.DEBUG = this.DEBUG.bind(this);
            this._tick = this._tick.bind(this);
            requestAnimationFrame(this._tick);
        }
        /**
         * Debug helper, ideal as a map generator callback. Always bound to this.
         * @param {int} x
         * @param {int} y
         * @param {int} what
         */
        DEBUG(x, y, what) {
            let colors = [this._options.bg, this._options.fg];
            this.draw(x, y, null, null, colors[what % colors.length]);
        }
        /**
         * Clear the whole display (cover it with background color)
         */
        clear() {
            this._data = {};
            this._dirty = true;
        }
        /**
         * @see ROT.Display
         */
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
        /**
         * Returns currently set options
         * @returns {object} Current options object
         */
        getOptions() { return this._options; }
        /**
         * Returns the DOM node of this display
         * @returns {node} DOM node
         */
        getContainer() { return this._context.canvas; }
        /**
         * Compute the maximum width/height to fit into a set of given constraints
         * @param {int} availWidth Maximum allowed pixel width
         * @param {int} availHeight Maximum allowed pixel height
         * @returns {int[2]} cellWidth,cellHeight
         */
        computeSize(availWidth, availHeight) {
            return this._backend.computeSize(availWidth, availHeight);
        }
        /**
         * Compute the maximum font size to fit into a set of given constraints
         * @param {int} availWidth Maximum allowed pixel width
         * @param {int} availHeight Maximum allowed pixel height
         * @returns {int} fontSize
         */
        computeFontSize(availWidth, availHeight) {
            return this._backend.computeFontSize(availWidth, availHeight);
        }
        /**
         * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
         * @param {Event} e event
         * @returns {int[2]} -1 for values outside of the canvas
         */
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
        /**
         * @param {int} x
         * @param {int} y
         * @param {string || string[]} ch One or more chars (will be overlapping themselves)
         * @param {string} [fg] foreground color
         * @param {string} [bg] background color
         */
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
            } /* will already redraw everything */
            if (!this._dirty) {
                this._dirty = {};
            } /* first! */
            this._dirty[key] = true;
        }
        /**
         * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
         * @param {int} x
         * @param {int} y
         * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
         * @param {int} [maxWidth] wrap at what width?
         * @returns {int} lines drawn
         */
        drawText(x, y, text, maxWidth) {
            let fg = null;
            let bg = null;
            let cx = x;
            let cy = y;
            let lines = 1;
            if (!maxWidth) {
                maxWidth = this._options.width - x;
            }
            let tokens = tokenize(text, maxWidth);
            while (tokens.length) { /* interpret tokenized opcode stream */
                let token = tokens.shift();
                switch (token.type) {
                    case TYPE_TEXT:
                        let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
                        for (let i = 0; i < token.value.length; i++) {
                            let cc = token.value.charCodeAt(i);
                            let c = token.value.charAt(i);
                            // Assign to `true` when the current char is full-width.
                            isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
                            // Current char is space, whatever full-width or half-width both are OK.
                            isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
                            // The previous char is full-width and
                            // current char is nether half-width nor a space.
                            if (isPrevFullWidth && !isFullWidth && !isSpace) {
                                cx++;
                            } // add an extra position
                            // The current char is full-width and
                            // the previous char is not a space.
                            if (isFullWidth && !isPrevSpace) {
                                cx++;
                            } // add an extra position
                            this.draw(cx++, cy, c, fg, bg);
                            isPrevSpace = isSpace;
                            isPrevFullWidth = isFullWidth;
                        }
                        break;
                    case TYPE_FG:
                        fg = token.value || null;
                        break;
                    case TYPE_BG:
                        bg = token.value || null;
                        break;
                    case TYPE_NEWLINE:
                        cx = x;
                        cy++;
                        lines++;
                        break;
                }
            }
            return lines;
        }
        /**
         * Timer tick: update dirty parts
         */
        _tick() {
            requestAnimationFrame(this._tick);
            if (!this._dirty) {
                return;
            }
            if (this._dirty === true) { // draw all
                this._context.fillStyle = this._options.bg;
                this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
                for (let id in this._data) {
                    this._draw(id, false);
                } // redraw cached data 
            }
            else { // draw only dirty 
                for (let key in this._dirty) {
                    this._draw(key, true);
                }
            }
            this._dirty = false;
        }
        /**
         * @param {string} key What to draw
         * @param {bool} clearBefore Is it necessary to clean before?
         */
        _draw(key, clearBefore) {
            let data = this._data[key];
            if (data[4] != this._options.bg) {
                clearBefore = true;
            }
            this._backend.draw(data, clearBefore);
        }
    }

    const util = { clamp, mod };

    exports.util = util;
    exports.RNG = rng;
    exports.Display = Display;

    return exports;

}({}));
