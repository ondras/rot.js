"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

(function () {
  'use strict';

  var FRAC = 2.3283064365386963e-10;

  var RNG =
  /*#__PURE__*/
  function () {
    function RNG() {
      this._seed = 0;
      this._s0 = 0;
      this._s1 = 0;
      this._s2 = 0;
      this._c = 0;
    }

    var _proto = RNG.prototype;

    _proto.getSeed = function getSeed() {
      return this._seed;
    };

    _proto.setSeed = function setSeed(seed) {
      seed = seed < 1 ? 1 / seed : seed;
      this._seed = seed;
      this._s0 = (seed >>> 0) * FRAC;
      seed = seed * 69069 + 1 >>> 0;
      this._s1 = seed * FRAC;
      seed = seed * 69069 + 1 >>> 0;
      this._s2 = seed * FRAC;
      this._c = 1;
      return this;
    };

    _proto.getUniform = function getUniform() {
      var t = 2091639 * this._s0 + this._c * FRAC;
      this._s0 = this._s1;
      this._s1 = this._s2;
      this._c = t | 0;
      this._s2 = t - this._c;
      return this._s2;
    };

    _proto.getUniformInt = function getUniformInt(lowerBound, upperBound) {
      var max = Math.max(lowerBound, upperBound);
      var min = Math.min(lowerBound, upperBound);
      return Math.floor(this.getUniform() * (max - min + 1)) + min;
    };

    _proto.getNormal = function getNormal(mean, stddev) {
      if (mean === void 0) {
        mean = 0;
      }

      if (stddev === void 0) {
        stddev = 1;
      }

      var u, v, r;

      do {
        u = 2 * this.getUniform() - 1;
        v = 2 * this.getUniform() - 1;
        r = u * u + v * v;
      } while (r > 1 || r == 0);

      var gauss = u * Math.sqrt(-2 * Math.log(r) / r);
      return mean + gauss * stddev;
    };

    _proto.getPercentage = function getPercentage() {
      return 1 + Math.floor(this.getUniform() * 100);
    };

    _proto.getItem = function getItem(array) {
      if (!array.length) {
        return null;
      }

      return array[Math.floor(this.getUniform() * array.length)];
    };

    _proto.shuffle = function shuffle(array) {
      var result = [];
      var clone = array.slice();

      while (clone.length) {
        var index = clone.indexOf(this.getItem(clone));
        result.push(clone.splice(index, 1)[0]);
      }

      return result;
    };

    _proto.getWeightedValue = function getWeightedValue(data) {
      var total = 0;

      for (var _id in data) {
        total += data[_id];
      }

      var random = this.getUniform() * total;
      var id,
          part = 0;

      for (id in data) {
        part += data[id];

        if (random < part) {
          return id;
        }
      }

      return id;
    };

    _proto.getState = function getState() {
      return [this._s0, this._s1, this._s2, this._c];
    };

    _proto.setState = function setState(state) {
      this._s0 = state[0];
      this._s1 = state[1];
      this._s2 = state[2];
      this._c = state[3];
      return this;
    };

    _proto.clone = function clone() {
      var clone = new RNG();
      return clone.setState(this.getState());
    };

    return RNG;
  }();

  new RNG().setSeed(Date.now());

  var Backend =
  /*#__PURE__*/
  function () {
    function Backend(context) {
      this._context = context;
    }

    var _proto2 = Backend.prototype;

    _proto2.compute = function compute(options) {
      this._options = options;
    };

    return Backend;
  }();

  function mod(x, n) {
    return (x % n + n) % n;
  }

  var Hex =
  /*#__PURE__*/
  function (_Backend) {
    _inheritsLoose(Hex, _Backend);

    function Hex(context) {
      var _this;

      _this = _Backend.call(this, context) || this;
      _this._spacingX = 0;
      _this._spacingY = 0;
      _this._hexSize = 0;
      return _this;
    }

    var _proto3 = Hex.prototype;

    _proto3.compute = function compute(options) {
      _Backend.prototype.compute.call(this, options);

      var charWidth = Math.ceil(this._context.measureText("W").width);
      this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth / Math.sqrt(3)) / 2);
      this._spacingX = this._hexSize * Math.sqrt(3) / 2;
      this._spacingY = this._hexSize * 1.5;
      var xprop;
      var yprop;

      if (options.transpose) {
        xprop = "height";
        yprop = "width";
      } else {
        xprop = "width";
        yprop = "height";
      }

      this._context.canvas[xprop] = Math.ceil((options.width + 1) * this._spacingX);
      this._context.canvas[yprop] = Math.ceil((options.height - 1) * this._spacingY + 2 * this._hexSize);
    };

    _proto3.draw = function draw(data, clearBefore) {
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];
      var px = [(x + 1) * this._spacingX, y * this._spacingY + this._hexSize];

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
      var chars = [].concat(ch);

      for (var i = 0; i < chars.length; i++) {
        this._context.fillText(chars[i], px[0], Math.ceil(px[1]));
      }
    };

    _proto3.computeSize = function computeSize(availWidth, availHeight) {
      if (this._options.transpose) {
        availWidth += availHeight;
        availHeight = availWidth - availHeight;
        availWidth -= availHeight;
      }

      var width = Math.floor(availWidth / this._spacingX) - 1;
      var height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
      return [width, height];
    };

    _proto3.computeFontSize = function computeFontSize(availWidth, availHeight) {
      if (this._options.transpose) {
        availWidth += availHeight;
        availHeight = availWidth - availHeight;
        availWidth -= availHeight;
      }

      var hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
      var hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
      var hexSize = Math.min(hexSizeWidth, hexSizeHeight);
      var oldFont = this._context.font;
      this._context.font = "100px " + this._options.fontFamily;
      var width = Math.ceil(this._context.measureText("W").width);
      this._context.font = oldFont;
      var ratio = width / 100;
      hexSize = Math.floor(hexSize) + 1;
      var fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
      return Math.ceil(fontSize) - 1;
    };

    _proto3.eventToPosition = function eventToPosition(x, y) {
      var nodeSize;

      if (this._options.transpose) {
        x += y;
        y = x - y;
        x -= y;
        nodeSize = this._context.canvas.width;
      } else {
        nodeSize = this._context.canvas.height;
      }

      var size = nodeSize / this._options.height;
      y = Math.floor(y / size);

      if (mod(y, 2)) {
        x -= this._spacingX;
        x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
      } else {
        x = 2 * Math.floor(x / (2 * this._spacingX));
      }

      return [x, y];
    };

    _proto3._fill = function _fill(cx, cy) {
      var a = this._hexSize;
      var b = this._options.border;

      this._context.beginPath();

      if (this._options.transpose) {
        this._context.moveTo(cx - a + b, cy);

        this._context.lineTo(cx - a / 2 + b, cy + this._spacingX - b);

        this._context.lineTo(cx + a / 2 - b, cy + this._spacingX - b);

        this._context.lineTo(cx + a - b, cy);

        this._context.lineTo(cx + a / 2 - b, cy - this._spacingX + b);

        this._context.lineTo(cx - a / 2 + b, cy - this._spacingX + b);

        this._context.lineTo(cx - a + b, cy);
      } else {
        this._context.moveTo(cx, cy - a + b);

        this._context.lineTo(cx + this._spacingX - b, cy - a / 2 + b);

        this._context.lineTo(cx + this._spacingX - b, cy + a / 2 - b);

        this._context.lineTo(cx, cy + a - b);

        this._context.lineTo(cx - this._spacingX + b, cy + a / 2 - b);

        this._context.lineTo(cx - this._spacingX + b, cy - a / 2 + b);

        this._context.lineTo(cx, cy - a + b);
      }

      this._context.fill();
    };

    return Hex;
  }(Backend);

  var Rect =
  /*#__PURE__*/
  function (_Backend2) {
    _inheritsLoose(Rect, _Backend2);

    function Rect(context) {
      var _this2;

      _this2 = _Backend2.call(this, context) || this;
      _this2._spacingX = 0;
      _this2._spacingY = 0;
      _this2._canvasCache = {};
      return _this2;
    }

    var _proto4 = Rect.prototype;

    _proto4.compute = function compute(options) {
      _Backend2.prototype.compute.call(this, options);

      this._canvasCache = {};
      var charWidth = Math.ceil(this._context.measureText("W").width);
      this._spacingX = Math.ceil(options.spacing * charWidth);
      this._spacingY = Math.ceil(options.spacing * options.fontSize);

      if (this._options.forceSquareRatio) {
        this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
      }

      this._context.canvas.width = options.width * this._spacingX;
      this._context.canvas.height = options.height * this._spacingY;
    };

    _proto4.draw = function draw(data, clearBefore) {
      if (Rect.cache) {
        this._drawWithCache(data);
      } else {
        this._drawNoCache(data, clearBefore);
      }
    };

    _proto4._drawWithCache = function _drawWithCache(data) {
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];
      var hash = "" + ch + fg + bg;
      var canvas;

      if (hash in this._canvasCache) {
        canvas = this._canvasCache[hash];
      } else {
        var b = this._options.border;
        canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = this._spacingX;
        canvas.height = this._spacingY;
        ctx.fillStyle = bg;
        ctx.fillRect(b, b, canvas.width - b, canvas.height - b);

        if (ch) {
          ctx.fillStyle = fg;
          ctx.font = this._context.font;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          var chars = [].concat(ch);

          for (var i = 0; i < chars.length; i++) {
            ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
          }
        }

        this._canvasCache[hash] = canvas;
      }

      this._context.drawImage(canvas, x * this._spacingX, y * this._spacingY);
    };

    _proto4._drawNoCache = function _drawNoCache(data, clearBefore) {
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];

      if (clearBefore) {
        var b = this._options.border;
        this._context.fillStyle = bg;

        this._context.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
      }

      if (!ch) {
        return;
      }

      this._context.fillStyle = fg;
      var chars = [].concat(ch);

      for (var i = 0; i < chars.length; i++) {
        this._context.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
      }
    };

    _proto4.computeSize = function computeSize(availWidth, availHeight) {
      var width = Math.floor(availWidth / this._spacingX);
      var height = Math.floor(availHeight / this._spacingY);
      return [width, height];
    };

    _proto4.computeFontSize = function computeFontSize(availWidth, availHeight) {
      var boxWidth = Math.floor(availWidth / this._options.width);
      var boxHeight = Math.floor(availHeight / this._options.height);
      var oldFont = this._context.font;
      this._context.font = "100px " + this._options.fontFamily;
      var width = Math.ceil(this._context.measureText("W").width);
      this._context.font = oldFont;
      var ratio = width / 100;
      var widthFraction = ratio * boxHeight / boxWidth;

      if (widthFraction > 1) {
        boxHeight = Math.floor(boxHeight / widthFraction);
      }

      return Math.floor(boxHeight / this._options.spacing);
    };

    _proto4.eventToPosition = function eventToPosition(x, y) {
      return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
    };

    return Rect;
  }(Backend);

  Rect.cache = false;

  var Tile =
  /*#__PURE__*/
  function (_Backend3) {
    _inheritsLoose(Tile, _Backend3);

    function Tile(context) {
      var _this3;

      _this3 = _Backend3.call(this, context) || this;
      _this3._colorCanvas = document.createElement("canvas");
      return _this3;
    }

    var _proto5 = Tile.prototype;

    _proto5.compute = function compute(options) {
      _Backend3.prototype.compute.call(this, options);

      this._context.canvas.width = options.width * options.tileWidth;
      this._context.canvas.height = options.height * options.tileHeight;
      this._colorCanvas.width = options.tileWidth;
      this._colorCanvas.height = options.tileHeight;
    };

    _proto5.draw = function draw(data, clearBefore) {
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];
      var tileWidth = this._options.tileWidth;
      var tileHeight = this._options.tileHeight;

      if (clearBefore) {
        if (this._options.tileColorize) {
          this._context.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        } else {
          this._context.fillStyle = bg;

          this._context.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        }
      }

      if (!ch) {
        return;
      }

      var chars = [].concat(ch);
      var fgs = [].concat(fg);
      var bgs = [].concat(bg);

      for (var i = 0; i < chars.length; i++) {
        var tile = this._options.tileMap[chars[i]];

        if (!tile) {
          throw new Error("Char '" + chars[i] + "' not found in tileMap");
        }

        if (this._options.tileColorize) {
          var canvas = this._colorCanvas;
          var context = canvas.getContext("2d");
          context.globalCompositeOperation = "source-over";
          context.clearRect(0, 0, tileWidth, tileHeight);
          var _fg = fgs[i];
          var _bg = bgs[i];
          context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

          if (_fg != "transparent") {
            context.fillStyle = _fg;
            context.globalCompositeOperation = "source-atop";
            context.fillRect(0, 0, tileWidth, tileHeight);
          }

          if (_bg != "transparent") {
            context.fillStyle = _bg;
            context.globalCompositeOperation = "destination-over";
            context.fillRect(0, 0, tileWidth, tileHeight);
          }

          this._context.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        } else {
          this._context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        }
      }
    };

    _proto5.computeSize = function computeSize(availWidth, availHeight) {
      var width = Math.floor(availWidth / this._options.tileWidth);
      var height = Math.floor(availHeight / this._options.tileHeight);
      return [width, height];
    };

    _proto5.computeFontSize = function computeFontSize() {
      throw new Error("Tile backend does not understand font size");
    };

    _proto5.eventToPosition = function eventToPosition(x, y) {
      return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    };

    return Tile;
  }(Backend);

  var RE_COLORS = /%([bc]){([^}]*)}/g;
  var TYPE_TEXT = 0;
  var TYPE_NEWLINE = 1;
  var TYPE_FG = 2;
  var TYPE_BG = 3;

  function tokenize(str, maxWidth) {
    var result = [];
    var offset = 0;
    str.replace(RE_COLORS, function (match, type, name, index) {
      var part = str.substring(offset, index);

      if (part.length) {
        result.push({
          type: TYPE_TEXT,
          value: part
        });
      }

      result.push({
        type: type == "c" ? TYPE_FG : TYPE_BG,
        value: name.trim()
      });
      offset = index + match.length;
      return "";
    });
    var part = str.substring(offset);

    if (part.length) {
      result.push({
        type: TYPE_TEXT,
        value: part
      });
    }

    return breakLines(result, maxWidth);
  }

  function breakLines(tokens, maxWidth) {
    if (!maxWidth) {
      maxWidth = Infinity;
    }

    var i = 0;
    var lineLength = 0;
    var lastTokenWithSpace = -1;

    while (i < tokens.length) {
      var token = tokens[i];

      if (token.type == TYPE_NEWLINE) {
        lineLength = 0;
        lastTokenWithSpace = -1;
      }

      if (token.type != TYPE_TEXT) {
        i++;
        continue;
      }

      while (lineLength == 0 && token.value.charAt(0) == " ") {
        token.value = token.value.substring(1);
      }

      var index = token.value.indexOf("\n");

      if (index != -1) {
        token.value = breakInsideToken(tokens, i, index, true);
        var arr = token.value.split("");

        while (arr.length && arr[arr.length - 1] == " ") {
          arr.pop();
        }

        token.value = arr.join("");
      }

      if (!token.value.length) {
        tokens.splice(i, 1);
        continue;
      }

      if (lineLength + token.value.length > maxWidth) {
        var _index = -1;

        while (1) {
          var nextIndex = token.value.indexOf(" ", _index + 1);

          if (nextIndex == -1) {
            break;
          }

          if (lineLength + nextIndex > maxWidth) {
            break;
          }

          _index = nextIndex;
        }

        if (_index != -1) {
          token.value = breakInsideToken(tokens, i, _index, true);
        } else if (lastTokenWithSpace != -1) {
          var _token = tokens[lastTokenWithSpace];

          var breakIndex = _token.value.lastIndexOf(" ");

          _token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
          i = lastTokenWithSpace;
        } else {
          token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
        }
      } else {
        lineLength += token.value.length;

        if (token.value.indexOf(" ") != -1) {
          lastTokenWithSpace = i;
        }
      }

      i++;
    }

    tokens.push({
      type: TYPE_NEWLINE
    });
    var lastTextToken = null;

    for (var _i = 0; _i < tokens.length; _i++) {
      var _token2 = tokens[_i];

      switch (_token2.type) {
        case TYPE_TEXT:
          lastTextToken = _token2;
          break;

        case TYPE_NEWLINE:
          if (lastTextToken) {
            var _arr = lastTextToken.value.split("");

            while (_arr.length && _arr[_arr.length - 1] == " ") {
              _arr.pop();
            }

            lastTextToken.value = _arr.join("");
          }

          lastTextToken = null;
          break;
      }
    }

    tokens.pop();
    return tokens;
  }

  function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
    var newBreakToken = {
      type: TYPE_NEWLINE
    };
    var newTextToken = {
      type: TYPE_TEXT,
      value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
    };
    tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
    return tokens[tokenIndex].value.substring(0, breakIndex);
  }

  var DEFAULT_WIDTH = 80;
  var DEFAULT_HEIGHT = 25;
  var BACKENDS = {
    "hex": Hex,
    "rect": Rect,
    "tile": Tile
  };
  var DEFAULT_OPTIONS = {
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

  var Display =
  /*#__PURE__*/
  function () {
    function Display(options) {
      if (options === void 0) {
        options = {};
      }

      var canvas = document.createElement("canvas");
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

    var _proto6 = Display.prototype;

    _proto6.DEBUG = function DEBUG(x, y, what) {
      var colors = [this._options.bg, this._options.fg];
      this.draw(x, y, null, null, colors[what % colors.length]);
    };

    _proto6.clear = function clear() {
      this._data = {};
      this._dirty = true;
    };

    _proto6.setOptions = function setOptions(options) {
      Object.assign(this._options, options);

      if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
        if (options.layout) {
          var ctor = BACKENDS[options.layout];
          this._backend = new ctor(this._context);
        }

        var font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily;
        this._context.font = font;

        this._backend.compute(this._options);

        this._context.font = font;
        this._context.textAlign = "center";
        this._context.textBaseline = "middle";
        this._dirty = true;
      }

      return this;
    };

    _proto6.getOptions = function getOptions() {
      return this._options;
    };

    _proto6.getContainer = function getContainer() {
      return this._context.canvas;
    };

    _proto6.computeSize = function computeSize(availWidth, availHeight) {
      return this._backend.computeSize(availWidth, availHeight);
    };

    _proto6.computeFontSize = function computeFontSize(availWidth, availHeight) {
      return this._backend.computeFontSize(availWidth, availHeight);
    };

    _proto6.computeTileSize = function computeTileSize(availWidth, availHeight) {
      var width = Math.floor(availWidth / this._options.width);
      var height = Math.floor(availHeight / this._options.height);
      return [width, height];
    };

    _proto6.eventToPosition = function eventToPosition(e) {
      var x, y;

      if ("touches" in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      var rect = this._context.canvas.getBoundingClientRect();

      x -= rect.left;
      y -= rect.top;
      x *= this._context.canvas.width / rect.width;
      y *= this._context.canvas.height / rect.height;

      if (x < 0 || y < 0 || x >= this._context.canvas.width || y >= this._context.canvas.height) {
        return [-1, -1];
      }

      return this._backend.eventToPosition(x, y);
    };

    _proto6.draw = function draw(x, y, ch, fg, bg) {
      if (!fg) {
        fg = this._options.fg;
      }

      if (!bg) {
        bg = this._options.bg;
      }

      var key = x + "," + y;
      this._data[key] = [x, y, ch, fg, bg];

      if (this._dirty === true) {
        return;
      }

      if (!this._dirty) {
        this._dirty = {};
      }

      this._dirty[key] = true;
    };

    _proto6.drawText = function drawText(x, y, text, maxWidth) {
      var fg = null;
      var bg = null;
      var cx = x;
      var cy = y;
      var lines = 1;

      if (!maxWidth) {
        maxWidth = this._options.width - x;
      }

      var tokens = tokenize(text, maxWidth);

      while (tokens.length) {
        var token = tokens.shift();

        switch (token.type) {
          case TYPE_TEXT:
            var isSpace = false,
                isPrevSpace = false,
                isFullWidth = false,
                isPrevFullWidth = false;

            for (var i = 0; i < token.value.length; i++) {
              var cc = token.value.charCodeAt(i);
              var c = token.value.charAt(i);
              isFullWidth = cc > 0xff00 && cc < 0xff61 || cc > 0xffdc && cc < 0xffe8 || cc > 0xffee;
              isSpace = c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000;

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
    };

    _proto6._tick = function _tick() {
      requestAnimationFrame(this._tick);

      if (!this._dirty) {
        return;
      }

      if (this._dirty === true) {
        this._context.fillStyle = this._options.bg;

        this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        for (var id in this._data) {
          this._draw(id, false);
        }
      } else {
        for (var key in this._dirty) {
          this._draw(key, true);
        }
      }

      this._dirty = false;
    };

    _proto6._draw = function _draw(key, clearBefore) {
      var data = this._data[key];

      if (data[4] != this._options.bg) {
        clearBefore = true;
      }

      this._backend.draw(data, clearBefore);
    };

    return Display;
  }();

  Display.Rect = Rect;
  Display.Hex = Hex;
  Display.Tile = Tile;
  var o = {
    width: 11,
    height: 5
  };
  var d = new Display(o);
  document.body.appendChild(d.getContainer());

  for (var i = 0; i < o.width; i++) {
    for (var j = 0; j < o.width; j++) {
      if (!i || !j || i + 1 == o.width || j + 1 == o.height) {
        d.draw(i, j, "#", "gray");
      } else {
        d.draw(i, j, ".", "#666");
      }
    }
  }

  d.draw(o.width >> 1, o.height >> 1, "@", "goldenrod");
})();

