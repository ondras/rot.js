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
         * @returns {any} Randomly picked item, null when length=0
         */
        getItem(array) {
            if (!array.length) {
                return null;
            }
            return array[Math.floor(this.getUniform() * array.length)];
        }
        /**
         * @returns {array} New array with randomized items
         */
        shuffle(array) {
            let result = [];
            let clone = array.slice();
            while (clone.length) {
                let index = clone.indexOf(this.getItem(clone));
                result.push(clone.splice(index, 1)[0]);
            }
            return result;
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
    var RNG$1 = new RNG().setSeed(Date.now());

    /**
     * @class Abstract display backend module
     * @private
     */
    class Backend {
        constructor(context) { this._context = context; }
        compute(options) { this._options = options; }
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
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substring(1);
    }
    /**
     * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
     * @param {string} template
     * @param {any} [argv]
     */
    function format(template, ...args) {
        let map = format.map;
        let replacer = function (match, group1, group2, index) {
            if (template.charAt(index - 1) == "%") {
                return match.substring(1);
            }
            if (!args.length) {
                return match;
            }
            let obj = args[0];
            let group = group1 || group2;
            let parts = group.split(",");
            let name = parts.shift() || "";
            let method = map[name.toLowerCase()];
            if (!method) {
                return match;
            }
            obj = args.shift();
            let replaced = obj[method].apply(obj, parts);
            let first = name.charAt(0);
            if (first != first.toLowerCase()) {
                replaced = capitalize(replaced);
            }
            return replaced;
        };
        return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
    }
    format.map = {
        "s": "toString"
    };

    var util = /*#__PURE__*/Object.freeze({
        mod: mod,
        clamp: clamp,
        capitalize: capitalize,
        format: format
    });

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
                this._drawWithCache(data);
            }
            else {
                this._drawNoCache(data, clearBefore);
            }
        }
        _drawWithCache(data) {
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
        computeFontSize() {
            throw new Error("Tile backend does not understand font size");
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
    const DIRS = {
        4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
        8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
        6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
    };
    const KEYS = {
        /** Cancel key. */
        VK_CANCEL: 3,
        /** Help key. */
        VK_HELP: 6,
        /** Backspace key. */
        VK_BACK_SPACE: 8,
        /** Tab key. */
        VK_TAB: 9,
        /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
        VK_CLEAR: 12,
        /** Return/enter key on the main keyboard. */
        VK_RETURN: 13,
        /** Reserved, but not used. */
        VK_ENTER: 14,
        /** Shift key. */
        VK_SHIFT: 16,
        /** Control key. */
        VK_CONTROL: 17,
        /** Alt (Option on Mac) key. */
        VK_ALT: 18,
        /** Pause key. */
        VK_PAUSE: 19,
        /** Caps lock. */
        VK_CAPS_LOCK: 20,
        /** Escape key. */
        VK_ESCAPE: 27,
        /** Space bar. */
        VK_SPACE: 32,
        /** Page Up key. */
        VK_PAGE_UP: 33,
        /** Page Down key. */
        VK_PAGE_DOWN: 34,
        /** End key. */
        VK_END: 35,
        /** Home key. */
        VK_HOME: 36,
        /** Left arrow. */
        VK_LEFT: 37,
        /** Up arrow. */
        VK_UP: 38,
        /** Right arrow. */
        VK_RIGHT: 39,
        /** Down arrow. */
        VK_DOWN: 40,
        /** Print Screen key. */
        VK_PRINTSCREEN: 44,
        /** Ins(ert) key. */
        VK_INSERT: 45,
        /** Del(ete) key. */
        VK_DELETE: 46,
        /***/
        VK_0: 48,
        /***/
        VK_1: 49,
        /***/
        VK_2: 50,
        /***/
        VK_3: 51,
        /***/
        VK_4: 52,
        /***/
        VK_5: 53,
        /***/
        VK_6: 54,
        /***/
        VK_7: 55,
        /***/
        VK_8: 56,
        /***/
        VK_9: 57,
        /** Colon (:) key. Requires Gecko 15.0 */
        VK_COLON: 58,
        /** Semicolon (;) key. */
        VK_SEMICOLON: 59,
        /** Less-than (<) key. Requires Gecko 15.0 */
        VK_LESS_THAN: 60,
        /** Equals (=) key. */
        VK_EQUALS: 61,
        /** Greater-than (>) key. Requires Gecko 15.0 */
        VK_GREATER_THAN: 62,
        /** Question mark (?) key. Requires Gecko 15.0 */
        VK_QUESTION_MARK: 63,
        /** Atmark (@) key. Requires Gecko 15.0 */
        VK_AT: 64,
        /***/
        VK_A: 65,
        /***/
        VK_B: 66,
        /***/
        VK_C: 67,
        /***/
        VK_D: 68,
        /***/
        VK_E: 69,
        /***/
        VK_F: 70,
        /***/
        VK_G: 71,
        /***/
        VK_H: 72,
        /***/
        VK_I: 73,
        /***/
        VK_J: 74,
        /***/
        VK_K: 75,
        /***/
        VK_L: 76,
        /***/
        VK_M: 77,
        /***/
        VK_N: 78,
        /***/
        VK_O: 79,
        /***/
        VK_P: 80,
        /***/
        VK_Q: 81,
        /***/
        VK_R: 82,
        /***/
        VK_S: 83,
        /***/
        VK_T: 84,
        /***/
        VK_U: 85,
        /***/
        VK_V: 86,
        /***/
        VK_W: 87,
        /***/
        VK_X: 88,
        /***/
        VK_Y: 89,
        /***/
        VK_Z: 90,
        /***/
        VK_CONTEXT_MENU: 93,
        /** 0 on the numeric keypad. */
        VK_NUMPAD0: 96,
        /** 1 on the numeric keypad. */
        VK_NUMPAD1: 97,
        /** 2 on the numeric keypad. */
        VK_NUMPAD2: 98,
        /** 3 on the numeric keypad. */
        VK_NUMPAD3: 99,
        /** 4 on the numeric keypad. */
        VK_NUMPAD4: 100,
        /** 5 on the numeric keypad. */
        VK_NUMPAD5: 101,
        /** 6 on the numeric keypad. */
        VK_NUMPAD6: 102,
        /** 7 on the numeric keypad. */
        VK_NUMPAD7: 103,
        /** 8 on the numeric keypad. */
        VK_NUMPAD8: 104,
        /** 9 on the numeric keypad. */
        VK_NUMPAD9: 105,
        /** * on the numeric keypad. */
        VK_MULTIPLY: 106,
        /** + on the numeric keypad. */
        VK_ADD: 107,
        /***/
        VK_SEPARATOR: 108,
        /** - on the numeric keypad. */
        VK_SUBTRACT: 109,
        /** Decimal point on the numeric keypad. */
        VK_DECIMAL: 110,
        /** / on the numeric keypad. */
        VK_DIVIDE: 111,
        /** F1 key. */
        VK_F1: 112,
        /** F2 key. */
        VK_F2: 113,
        /** F3 key. */
        VK_F3: 114,
        /** F4 key. */
        VK_F4: 115,
        /** F5 key. */
        VK_F5: 116,
        /** F6 key. */
        VK_F6: 117,
        /** F7 key. */
        VK_F7: 118,
        /** F8 key. */
        VK_F8: 119,
        /** F9 key. */
        VK_F9: 120,
        /** F10 key. */
        VK_F10: 121,
        /** F11 key. */
        VK_F11: 122,
        /** F12 key. */
        VK_F12: 123,
        /** F13 key. */
        VK_F13: 124,
        /** F14 key. */
        VK_F14: 125,
        /** F15 key. */
        VK_F15: 126,
        /** F16 key. */
        VK_F16: 127,
        /** F17 key. */
        VK_F17: 128,
        /** F18 key. */
        VK_F18: 129,
        /** F19 key. */
        VK_F19: 130,
        /** F20 key. */
        VK_F20: 131,
        /** F21 key. */
        VK_F21: 132,
        /** F22 key. */
        VK_F22: 133,
        /** F23 key. */
        VK_F23: 134,
        /** F24 key. */
        VK_F24: 135,
        /** Num Lock key. */
        VK_NUM_LOCK: 144,
        /** Scroll Lock key. */
        VK_SCROLL_LOCK: 145,
        /** Circumflex (^) key. Requires Gecko 15.0 */
        VK_CIRCUMFLEX: 160,
        /** Exclamation (!) key. Requires Gecko 15.0 */
        VK_EXCLAMATION: 161,
        /** Double quote () key. Requires Gecko 15.0 */
        VK_DOUBLE_QUOTE: 162,
        /** Hash (#) key. Requires Gecko 15.0 */
        VK_HASH: 163,
        /** Dollar sign ($) key. Requires Gecko 15.0 */
        VK_DOLLAR: 164,
        /** Percent (%) key. Requires Gecko 15.0 */
        VK_PERCENT: 165,
        /** Ampersand (&) key. Requires Gecko 15.0 */
        VK_AMPERSAND: 166,
        /** Underscore (_) key. Requires Gecko 15.0 */
        VK_UNDERSCORE: 167,
        /** Open parenthesis (() key. Requires Gecko 15.0 */
        VK_OPEN_PAREN: 168,
        /** Close parenthesis ()) key. Requires Gecko 15.0 */
        VK_CLOSE_PAREN: 169,
        /* Asterisk (*) key. Requires Gecko 15.0 */
        VK_ASTERISK: 170,
        /** Plus (+) key. Requires Gecko 15.0 */
        VK_PLUS: 171,
        /** Pipe (|) key. Requires Gecko 15.0 */
        VK_PIPE: 172,
        /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
        VK_HYPHEN_MINUS: 173,
        /** Open curly bracket ({) key. Requires Gecko 15.0 */
        VK_OPEN_CURLY_BRACKET: 174,
        /** Close curly bracket (}) key. Requires Gecko 15.0 */
        VK_CLOSE_CURLY_BRACKET: 175,
        /** Tilde (~) key. Requires Gecko 15.0 */
        VK_TILDE: 176,
        /** Comma (,) key. */
        VK_COMMA: 188,
        /** Period (.) key. */
        VK_PERIOD: 190,
        /** Slash (/) key. */
        VK_SLASH: 191,
        /** Back tick (`) key. */
        VK_BACK_QUOTE: 192,
        /** Open square bracket ([) key. */
        VK_OPEN_BRACKET: 219,
        /** Back slash (\) key. */
        VK_BACK_SLASH: 220,
        /** Close square bracket (]) key. */
        VK_CLOSE_BRACKET: 221,
        /** Quote (''') key. */
        VK_QUOTE: 222,
        /** Meta key on Linux, Command key on Mac. */
        VK_META: 224,
        /** AltGr key on Linux. Requires Gecko 15.0 */
        VK_ALTGR: 225,
        /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
        VK_WIN: 91,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_KANA: 21,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_HANGUL: 21,
        /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
        VK_EISU: 22,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_JUNJA: 23,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_FINAL: 24,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_HANJA: 25,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_KANJI: 25,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_CONVERT: 28,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_NONCONVERT: 29,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_ACCEPT: 30,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_MODECHANGE: 31,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_SELECT: 41,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_PRINT: 42,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_EXECUTE: 43,
        /** Linux support for this keycode was added in Gecko 4.0.	 */
        VK_SLEEP: 95
    };

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
    Display.Rect = Rect;
    Display.Hex = Hex;
    Display.Tile = Tile;

    /**
     * @class (Markov process)-based string generator.
     * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
     * Offers configurable order and prior.
     * @param {object} [options]
     * @param {bool} [options.words=false] Use word mode?
     * @param {int} [options.order=3]
     * @param {float} [options.prior=0.001]
     */
    class StringGenerator {
        constructor(options) {
            this._options = {
                words: false,
                order: 3,
                prior: 0.001
            };
            Object.assign(this._options, options);
            this._boundary = String.fromCharCode(0);
            this._suffix = this._boundary;
            this._prefix = [];
            for (let i = 0; i < this._options.order; i++) {
                this._prefix.push(this._boundary);
            }
            this._priorValues = {};
            this._priorValues[this._boundary] = this._options.prior;
            this._data = {};
        }
        /**
         * Remove all learning data
         */
        clear() {
            this._data = {};
            this._priorValues = {};
        }
        /**
         * @returns {string} Generated string
         */
        generate() {
            let result = [this._sample(this._prefix)];
            while (result[result.length - 1] != this._boundary) {
                result.push(this._sample(result));
            }
            return this._join(result.slice(0, -1));
        }
        /**
         * Observe (learn) a string from a training set
         */
        observe(string) {
            let tokens = this._split(string);
            for (let i = 0; i < tokens.length; i++) {
                this._priorValues[tokens[i]] = this._options.prior;
            }
            tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */
            for (let i = this._options.order; i < tokens.length; i++) {
                let context = tokens.slice(i - this._options.order, i);
                let event = tokens[i];
                for (let j = 0; j < context.length; j++) {
                    let subcontext = context.slice(j);
                    this._observeEvent(subcontext, event);
                }
            }
        }
        getStats() {
            let parts = [];
            let priorCount = Object.keys(this._priorValues).length;
            priorCount--; // boundary
            parts.push("distinct samples: " + priorCount);
            let dataCount = Object.keys(this._data).length;
            let eventCount = 0;
            for (let p in this._data) {
                eventCount += Object.keys(this._data[p]).length;
            }
            parts.push("dictionary size (contexts): " + dataCount);
            parts.push("dictionary size (events): " + eventCount);
            return parts.join(", ");
        }
        /**
         * @param {string}
         * @returns {string[]}
         */
        _split(str) {
            return str.split(this._options.words ? /\s+/ : "");
        }
        /**
         * @param {string[]}
         * @returns {string}
         */
        _join(arr) {
            return arr.join(this._options.words ? " " : "");
        }
        /**
         * @param {string[]} context
         * @param {string} event
         */
        _observeEvent(context, event) {
            let key = this._join(context);
            if (!(key in this._data)) {
                this._data[key] = {};
            }
            let data = this._data[key];
            if (!(event in data)) {
                data[event] = 0;
            }
            data[event]++;
        }
        /**
         * @param {string[]}
         * @returns {string}
         */
        _sample(context) {
            context = this._backoff(context);
            let key = this._join(context);
            let data = this._data[key];
            let available = {};
            if (this._options.prior) {
                for (let event in this._priorValues) {
                    available[event] = this._priorValues[event];
                }
                for (let event in data) {
                    available[event] += data[event];
                }
            }
            else {
                available = data;
            }
            return RNG$1.getWeightedValue(available);
        }
        /**
         * @param {string[]}
         * @returns {string[]}
         */
        _backoff(context) {
            if (context.length > this._options.order) {
                context = context.slice(-this._options.order);
            }
            else if (context.length < this._options.order) {
                context = this._prefix.slice(0, this._options.order - context.length).concat(context);
            }
            while (!(this._join(context) in this._data) && context.length > 0) {
                context = context.slice(1);
            }
            return context;
        }
    }

    function fromString(str) {
        let cached, r;
        if (str in CACHE) {
            cached = CACHE[str];
        }
        else {
            if (str.charAt(0) == "#") { // hex rgb
                let matched = str.match(/[0-9a-f]/gi) || [];
                let values = matched.map((x) => parseInt(x, 16));
                if (values.length == 3) {
                    cached = values.map((x) => x * 17);
                }
                else {
                    for (let i = 0; i < 3; i++) {
                        values[i + 1] += 16 * values[i];
                        values.splice(i, 1);
                    }
                    cached = values;
                }
            }
            else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { // decimal rgb
                cached = r[1].split(/\s*,\s*/).map((x) => parseInt(x));
            }
            else { // html name
                cached = [0, 0, 0];
            }
            CACHE[str] = cached;
        }
        return cached.slice();
    }
    /**
     * Add two or more colors
     * @param {number[]} color1
     * @param {number[]} color2
     * @returns {number[]}
     */
    function add(color1, ...colors) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                result[i] += colors[j][i];
            }
        }
        return result;
    }
    /**
     * Add two or more colors, MODIFIES FIRST ARGUMENT
     * @param {number[]} color1
     * @param {number[]} color2
     * @returns {number[]}
     */
    function add_(color1, ...colors) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                color1[i] += colors[j][i];
            }
        }
        return color1;
    }
    /**
     * Multiply (mix) two or more colors
     * @param {number[]} color1
     * @param {number[]} color2
     * @returns {number[]}
     */
    function multiply(color1, ...colors) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                result[i] *= colors[j][i] / 255;
            }
            result[i] = Math.round(result[i]);
        }
        return result;
    }
    /**
     * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
     * @param {number[]} color1
     * @param {number[]} color2
     * @returns {number[]}
     */
    function multiply_(color1, ...colors) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                color1[i] *= colors[j][i] / 255;
            }
            color1[i] = Math.round(color1[i]);
        }
        return color1;
    }
    /**
     * Interpolate (blend) two colors with a given factor
     * @param {number[]} color1
     * @param {number[]} color2
     * @param {float} [factor=0.5] 0..1
     * @returns {number[]}
     */
    function interpolate(color1, color2, factor = 0.5) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }
    const lerp = interpolate;
    /**
     * Interpolate (blend) two colors with a given factor in HSL mode
     * @param {number[]} color1
     * @param {number[]} color2
     * @param {float} [factor=0.5] 0..1
     * @returns {number[]}
     */
    function interpolateHSL(color1, color2, factor = 0.5) {
        let hsl1 = rgb2hsl(color1);
        let hsl2 = rgb2hsl(color2);
        for (let i = 0; i < 3; i++) {
            hsl1[i] += factor * (hsl2[i] - hsl1[i]);
        }
        return hsl2rgb(hsl1);
    }
    const lerpHSL = interpolateHSL;
    /**
     * Create a new random color based on this one
     * @param {number[]} color
     * @param {number[]} diff Set of standard deviations
     * @returns {number[]}
     */
    function randomize(color, diff) {
        if (!(diff instanceof Array)) {
            diff = Math.round(RNG$1.getNormal(0, diff));
        }
        let result = color.slice();
        for (let i = 0; i < 3; i++) {
            result[i] += (diff instanceof Array ? Math.round(RNG$1.getNormal(0, diff[i])) : diff);
        }
        return result;
    }
    /**
     * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
     * @param {number[]} color
     * @returns {number[]}
     */
    function rgb2hsl(color) {
        let r = color[0] / 255;
        let g = color[1] / 255;
        let b = color[2] / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max == min) {
            s = 0; // achromatic
        }
        else {
            let d = max - min;
            s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }
    function hue2rgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    /**
     * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
     * @param {number[]} color
     * @returns {number[]}
     */
    function hsl2rgb(color) {
        let l = color[2];
        if (color[1] == 0) {
            l = Math.round(l * 255);
            return [l, l, l];
        }
        else {
            var s = color[1];
            var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
            var p = 2 * l - q;
            var r = hue2rgb(p, q, color[0] + 1 / 3);
            var g = hue2rgb(p, q, color[0]);
            var b = hue2rgb(p, q, color[0] - 1 / 3);
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
    }
    function toRGB(color) {
        let clamped = color.map(x => clamp(x, 0, 255));
        return `rgb(${clamped.join(",")})`;
    }
    function toHex(color) {
        let clamped = color.map(x => clamp(x, 0, 255).toString(16).padStart(2, "0"));
        return `#${clamped.join("")}`;
    }
    const CACHE = {
        "black": [0, 0, 0],
        "navy": [0, 0, 128],
        "darkblue": [0, 0, 139],
        "mediumblue": [0, 0, 205],
        "blue": [0, 0, 255],
        "darkgreen": [0, 100, 0],
        "green": [0, 128, 0],
        "teal": [0, 128, 128],
        "darkcyan": [0, 139, 139],
        "deepskyblue": [0, 191, 255],
        "darkturquoise": [0, 206, 209],
        "mediumspringgreen": [0, 250, 154],
        "lime": [0, 255, 0],
        "springgreen": [0, 255, 127],
        "aqua": [0, 255, 255],
        "cyan": [0, 255, 255],
        "midnightblue": [25, 25, 112],
        "dodgerblue": [30, 144, 255],
        "forestgreen": [34, 139, 34],
        "seagreen": [46, 139, 87],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "limegreen": [50, 205, 50],
        "mediumseagreen": [60, 179, 113],
        "turquoise": [64, 224, 208],
        "royalblue": [65, 105, 225],
        "steelblue": [70, 130, 180],
        "darkslateblue": [72, 61, 139],
        "mediumturquoise": [72, 209, 204],
        "indigo": [75, 0, 130],
        "darkolivegreen": [85, 107, 47],
        "cadetblue": [95, 158, 160],
        "cornflowerblue": [100, 149, 237],
        "mediumaquamarine": [102, 205, 170],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "slateblue": [106, 90, 205],
        "olivedrab": [107, 142, 35],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "mediumslateblue": [123, 104, 238],
        "lawngreen": [124, 252, 0],
        "chartreuse": [127, 255, 0],
        "aquamarine": [127, 255, 212],
        "maroon": [128, 0, 0],
        "purple": [128, 0, 128],
        "olive": [128, 128, 0],
        "gray": [128, 128, 128],
        "grey": [128, 128, 128],
        "skyblue": [135, 206, 235],
        "lightskyblue": [135, 206, 250],
        "blueviolet": [138, 43, 226],
        "darkred": [139, 0, 0],
        "darkmagenta": [139, 0, 139],
        "saddlebrown": [139, 69, 19],
        "darkseagreen": [143, 188, 143],
        "lightgreen": [144, 238, 144],
        "mediumpurple": [147, 112, 216],
        "darkviolet": [148, 0, 211],
        "palegreen": [152, 251, 152],
        "darkorchid": [153, 50, 204],
        "yellowgreen": [154, 205, 50],
        "sienna": [160, 82, 45],
        "brown": [165, 42, 42],
        "darkgray": [169, 169, 169],
        "darkgrey": [169, 169, 169],
        "lightblue": [173, 216, 230],
        "greenyellow": [173, 255, 47],
        "paleturquoise": [175, 238, 238],
        "lightsteelblue": [176, 196, 222],
        "powderblue": [176, 224, 230],
        "firebrick": [178, 34, 34],
        "darkgoldenrod": [184, 134, 11],
        "mediumorchid": [186, 85, 211],
        "rosybrown": [188, 143, 143],
        "darkkhaki": [189, 183, 107],
        "silver": [192, 192, 192],
        "mediumvioletred": [199, 21, 133],
        "indianred": [205, 92, 92],
        "peru": [205, 133, 63],
        "chocolate": [210, 105, 30],
        "tan": [210, 180, 140],
        "lightgray": [211, 211, 211],
        "lightgrey": [211, 211, 211],
        "palevioletred": [216, 112, 147],
        "thistle": [216, 191, 216],
        "orchid": [218, 112, 214],
        "goldenrod": [218, 165, 32],
        "crimson": [220, 20, 60],
        "gainsboro": [220, 220, 220],
        "plum": [221, 160, 221],
        "burlywood": [222, 184, 135],
        "lightcyan": [224, 255, 255],
        "lavender": [230, 230, 250],
        "darksalmon": [233, 150, 122],
        "violet": [238, 130, 238],
        "palegoldenrod": [238, 232, 170],
        "lightcoral": [240, 128, 128],
        "khaki": [240, 230, 140],
        "aliceblue": [240, 248, 255],
        "honeydew": [240, 255, 240],
        "azure": [240, 255, 255],
        "sandybrown": [244, 164, 96],
        "wheat": [245, 222, 179],
        "beige": [245, 245, 220],
        "whitesmoke": [245, 245, 245],
        "mintcream": [245, 255, 250],
        "ghostwhite": [248, 248, 255],
        "salmon": [250, 128, 114],
        "antiquewhite": [250, 235, 215],
        "linen": [250, 240, 230],
        "lightgoldenrodyellow": [250, 250, 210],
        "oldlace": [253, 245, 230],
        "red": [255, 0, 0],
        "fuchsia": [255, 0, 255],
        "magenta": [255, 0, 255],
        "deeppink": [255, 20, 147],
        "orangered": [255, 69, 0],
        "tomato": [255, 99, 71],
        "hotpink": [255, 105, 180],
        "coral": [255, 127, 80],
        "darkorange": [255, 140, 0],
        "lightsalmon": [255, 160, 122],
        "orange": [255, 165, 0],
        "lightpink": [255, 182, 193],
        "pink": [255, 192, 203],
        "gold": [255, 215, 0],
        "peachpuff": [255, 218, 185],
        "navajowhite": [255, 222, 173],
        "moccasin": [255, 228, 181],
        "bisque": [255, 228, 196],
        "mistyrose": [255, 228, 225],
        "blanchedalmond": [255, 235, 205],
        "papayawhip": [255, 239, 213],
        "lavenderblush": [255, 240, 245],
        "seashell": [255, 245, 238],
        "cornsilk": [255, 248, 220],
        "lemonchiffon": [255, 250, 205],
        "floralwhite": [255, 250, 240],
        "snow": [255, 250, 250],
        "yellow": [255, 255, 0],
        "lightyellow": [255, 255, 224],
        "ivory": [255, 255, 240],
        "white": [255, 255, 255]
    };

    var color = /*#__PURE__*/Object.freeze({
        fromString: fromString,
        add: add,
        add_: add_,
        multiply: multiply,
        multiply_: multiply_,
        interpolate: interpolate,
        lerp: lerp,
        interpolateHSL: interpolateHSL,
        lerpHSL: lerpHSL,
        randomize: randomize,
        rgb2hsl: rgb2hsl,
        hsl2rgb: hsl2rgb,
        toRGB: toRGB,
        toHex: toHex
    });

    const Util = util;
    const Color = color;

    exports.Util = Util;
    exports.Color = Color;
    exports.RNG = RNG$1;
    exports.Display = Display;
    exports.StringGenerator = StringGenerator;
    exports.DEFAULT_WIDTH = DEFAULT_WIDTH;
    exports.DEFAULT_HEIGHT = DEFAULT_HEIGHT;
    exports.DIRS = DIRS;
    exports.KEYS = KEYS;

    return exports;

}({}));
