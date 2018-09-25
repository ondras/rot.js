"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ROT = function (exports) {
  'use strict';
  /**
   * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
   * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
   */

  var FRAC = 2.3283064365386963e-10;
  /* 2^-32 */

  var RNG =
  /*#__PURE__*/
  function () {
    function RNG() {
      _classCallCheck(this, RNG);

      this._seed = 0;
      this._s0 = 0;
      this._s1 = 0;
      this._s2 = 0;
      this._c = 0;
    }

    _createClass(RNG, [{
      key: "getSeed",
      value: function getSeed() {
        return this._seed;
      }
      /**
       * Seed the number generator
       */

    }, {
      key: "setSeed",
      value: function setSeed(seed) {
        seed = seed < 1 ? 1 / seed : seed;
        this._seed = seed;
        this._s0 = (seed >>> 0) * FRAC;
        seed = seed * 69069 + 1 >>> 0;
        this._s1 = seed * FRAC;
        seed = seed * 69069 + 1 >>> 0;
        this._s2 = seed * FRAC;
        this._c = 1;
        return this;
      }
      /**
       * @returns Pseudorandom value [0,1), uniformly distributed
       */

    }, {
      key: "getUniform",
      value: function getUniform() {
        var t = 2091639 * this._s0 + this._c * FRAC;
        this._s0 = this._s1;
        this._s1 = this._s2;
        this._c = t | 0;
        this._s2 = t - this._c;
        return this._s2;
      }
      /**
       * @param lowerBound The lower end of the range to return a value from, inclusive
       * @param upperBound The upper end of the range to return a value from, inclusive
       * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
       */

    }, {
      key: "getUniformInt",
      value: function getUniformInt(lowerBound, upperBound) {
        var max = Math.max(lowerBound, upperBound);
        var min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
      }
      /**
       * @param mean Mean value
       * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
       * @returns A normally distributed pseudorandom value
       */

    }, {
      key: "getNormal",
      value: function getNormal() {
        var mean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var stddev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var u, v, r;

        do {
          u = 2 * this.getUniform() - 1;
          v = 2 * this.getUniform() - 1;
          r = u * u + v * v;
        } while (r > 1 || r == 0);

        var gauss = u * Math.sqrt(-2 * Math.log(r) / r);
        return mean + gauss * stddev;
      }
      /**
       * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
       */

    }, {
      key: "getPercentage",
      value: function getPercentage() {
        return 1 + Math.floor(this.getUniform() * 100);
      }
      /**
       * @returns Randomly picked item, null when length=0
       */

    }, {
      key: "getItem",
      value: function getItem(array) {
        if (!array.length) {
          return null;
        }

        return array[Math.floor(this.getUniform() * array.length)];
      }
      /**
       * @returns New array with randomized items
       */

    }, {
      key: "shuffle",
      value: function shuffle(array) {
        var result = [];
        var clone = array.slice();

        while (clone.length) {
          var _index = clone.indexOf(this.getItem(clone));

          result.push(clone.splice(_index, 1)[0]);
        }

        return result;
      }
      /**
       * @param data key=whatever, value=weight (relative probability)
       * @returns whatever
       */

    }, {
      key: "getWeightedValue",
      value: function getWeightedValue(data) {
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
        } // If by some floating-point annoyance we have
        // random >= total, just return the last id.


        return id;
      }
      /**
       * Get RNG state. Useful for storing the state and re-setting it via setState.
       * @returns Internal state
       */

    }, {
      key: "getState",
      value: function getState() {
        return [this._s0, this._s1, this._s2, this._c];
      }
      /**
       * Set a previously retrieved state.
       */

    }, {
      key: "setState",
      value: function setState(state) {
        this._s0 = state[0];
        this._s1 = state[1];
        this._s2 = state[2];
        this._c = state[3];
        return this;
      }
      /**
       * Returns a cloned RNG
       */

    }, {
      key: "clone",
      value: function clone() {
        var clone = new RNG();
        return clone.setState(this.getState());
      }
    }]);

    return RNG;
  }();

  var RNG$1 = new RNG().setSeed(Date.now());
  /**
   * @class Abstract display backend module
   * @private
   */

  var Backend =
  /*#__PURE__*/
  function () {
    function Backend(context) {
      _classCallCheck(this, Backend);

      this._context = context;
    }

    _createClass(Backend, [{
      key: "compute",
      value: function compute(options) {
        this._options = options;
      }
    }]);

    return Backend;
  }();
  /**
   * Always positive modulus
   * @param x Operand
   * @param n Modulus
   * @returns x modulo n
   */


  function mod(x, n) {
    return (x % n + n) % n;
  }

  function clamp(val) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    if (val < min) return min;
    if (val > max) return max;
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


  function format(template) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var map = format.map;

    var replacer = function replacer(match, group1, group2, index) {
      if (template.charAt(index - 1) == "%") {
        return match.substring(1);
      }

      if (!args.length) {
        return match;
      }

      var obj = args[0];
      var group = group1 || group2;
      var parts = group.split(",");
      var name = parts.shift() || "";
      var method = map[name.toLowerCase()];

      if (!method) {
        return match;
      }

      obj = args.shift();
      var replaced = obj[method].apply(obj, parts);
      var first = name.charAt(0);

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
  var util =
  /*#__PURE__*/
  Object.freeze({
    mod: mod,
    clamp: clamp,
    capitalize: capitalize,
    format: format
  });
  /**
   * @class Hexagonal backend
   * @private
   */

  var Hex =
  /*#__PURE__*/
  function (_Backend) {
    _inherits(Hex, _Backend);

    function Hex(context) {
      var _this;

      _classCallCheck(this, Hex);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Hex).call(this, context));
      _this._spacingX = 0;
      _this._spacingY = 0;
      _this._hexSize = 0;
      return _this;
    }

    _createClass(Hex, [{
      key: "compute",
      value: function compute(options) {
        _get(_getPrototypeOf(Hex.prototype), "compute", this).call(this, options);
        /* FIXME char size computation does not respect transposed hexes */


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
      }
    }, {
      key: "draw",
      value: function draw(data, clearBefore) {
        var _data = _slicedToArray(data, 5),
            x = _data[0],
            y = _data[1],
            ch = _data[2],
            fg = _data[3],
            bg = _data[4];

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
      }
    }, {
      key: "computeSize",
      value: function computeSize(availWidth, availHeight) {
        if (this._options.transpose) {
          availWidth += availHeight;
          availHeight = availWidth - availHeight;
          availWidth -= availHeight;
        }

        var width = Math.floor(availWidth / this._spacingX) - 1;
        var height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
        return [width, height];
      }
    }, {
      key: "computeFontSize",
      value: function computeFontSize(availWidth, availHeight) {
        if (this._options.transpose) {
          availWidth += availHeight;
          availHeight = availWidth - availHeight;
          availWidth -= availHeight;
        }

        var hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
        var hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
        var hexSize = Math.min(hexSizeWidth, hexSizeHeight);
        /* compute char ratio */

        var oldFont = this._context.font;
        this._context.font = "100px " + this._options.fontFamily;
        var width = Math.ceil(this._context.measureText("W").width);
        this._context.font = oldFont;
        var ratio = width / 100;
        hexSize = Math.floor(hexSize) + 1;
        /* closest larger hexSize */

        /* FIXME char size computation does not respect transposed hexes */

        var fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
        /* closest smaller fontSize */

        return Math.ceil(fontSize) - 1;
      }
    }, {
      key: "eventToPosition",
      value: function eventToPosition(x, y) {
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
          /* odd row */
          x -= this._spacingX;
          x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
        } else {
          x = 2 * Math.floor(x / (2 * this._spacingX));
        }

        return [x, y];
      }
      /**
       * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
       */

    }, {
      key: "_fill",
      value: function _fill(cx, cy) {
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
      }
    }]);

    return Hex;
  }(Backend);
  /**
   * @class Rectangular backend
   * @private
   */


  var Rect =
  /*#__PURE__*/
  function (_Backend2) {
    _inherits(Rect, _Backend2);

    function Rect(context) {
      var _this2;

      _classCallCheck(this, Rect);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, context));
      _this2._spacingX = 0;
      _this2._spacingY = 0;
      _this2._canvasCache = {};
      return _this2;
    }

    _createClass(Rect, [{
      key: "compute",
      value: function compute(options) {
        _get(_getPrototypeOf(Rect.prototype), "compute", this).call(this, options);

        this._canvasCache = {};
        var charWidth = Math.ceil(this._context.measureText("W").width);
        this._spacingX = Math.ceil(options.spacing * charWidth);
        this._spacingY = Math.ceil(options.spacing * options.fontSize);

        if (this._options.forceSquareRatio) {
          this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
        }

        this._context.canvas.width = options.width * this._spacingX;
        this._context.canvas.height = options.height * this._spacingY;
      }
    }, {
      key: "draw",
      value: function draw(data, clearBefore) {
        if (Rect.cache) {
          this._drawWithCache(data);
        } else {
          this._drawNoCache(data, clearBefore);
        }
      }
    }, {
      key: "_drawWithCache",
      value: function _drawWithCache(data) {
        var _data2 = _slicedToArray(data, 5),
            x = _data2[0],
            y = _data2[1],
            ch = _data2[2],
            fg = _data2[3],
            bg = _data2[4];

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
      }
    }, {
      key: "_drawNoCache",
      value: function _drawNoCache(data, clearBefore) {
        var _data3 = _slicedToArray(data, 5),
            x = _data3[0],
            y = _data3[1],
            ch = _data3[2],
            fg = _data3[3],
            bg = _data3[4];

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
      }
    }, {
      key: "computeSize",
      value: function computeSize(availWidth, availHeight) {
        var width = Math.floor(availWidth / this._spacingX);
        var height = Math.floor(availHeight / this._spacingY);
        return [width, height];
      }
    }, {
      key: "computeFontSize",
      value: function computeFontSize(availWidth, availHeight) {
        var boxWidth = Math.floor(availWidth / this._options.width);
        var boxHeight = Math.floor(availHeight / this._options.height);
        /* compute char ratio */

        var oldFont = this._context.font;
        this._context.font = "100px " + this._options.fontFamily;
        var width = Math.ceil(this._context.measureText("W").width);
        this._context.font = oldFont;
        var ratio = width / 100;
        var widthFraction = ratio * boxHeight / boxWidth;

        if (widthFraction > 1) {
          /* too wide with current aspect ratio */
          boxHeight = Math.floor(boxHeight / widthFraction);
        }

        return Math.floor(boxHeight / this._options.spacing);
      }
    }, {
      key: "eventToPosition",
      value: function eventToPosition(x, y) {
        return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
      }
    }]);

    return Rect;
  }(Backend);

  Rect.cache = false;
  /**
   * @class Tile backend
   * @private
   */

  var Tile =
  /*#__PURE__*/
  function (_Backend3) {
    _inherits(Tile, _Backend3);

    function Tile(context) {
      var _this3;

      _classCallCheck(this, Tile);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Tile).call(this, context));
      _this3._colorCanvas = document.createElement("canvas");
      return _this3;
    }

    _createClass(Tile, [{
      key: "compute",
      value: function compute(options) {
        _get(_getPrototypeOf(Tile.prototype), "compute", this).call(this, options);

        this._context.canvas.width = options.width * options.tileWidth;
        this._context.canvas.height = options.height * options.tileHeight;
        this._colorCanvas.width = options.tileWidth;
        this._colorCanvas.height = options.tileHeight;
      }
    }, {
      key: "draw",
      value: function draw(data, clearBefore) {
        var _data4 = _slicedToArray(data, 5),
            x = _data4[0],
            y = _data4[1],
            ch = _data4[2],
            fg = _data4[3],
            bg = _data4[4];

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
            /* apply colorization */
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
            /* no colorizing, easy */
            this._context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          }
        }
      }
    }, {
      key: "computeSize",
      value: function computeSize(availWidth, availHeight) {
        var width = Math.floor(availWidth / this._options.tileWidth);
        var height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
      }
    }, {
      key: "computeFontSize",
      value: function computeFontSize() {
        throw new Error("Tile backend does not understand font size");
      }
    }, {
      key: "eventToPosition",
      value: function eventToPosition(x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
      }
    }]);

    return Tile;
  }(Backend);
  /**
   * @namespace
   * Contains text tokenization and breaking routines
   */


  var RE_COLORS = /%([bc]){([^}]*)}/g; // token types

  var TYPE_TEXT = 0;
  var TYPE_NEWLINE = 1;
  var TYPE_FG = 2;
  var TYPE_BG = 3;
  /**
   * Measure size of a resulting text block
   */

  function measure(str, maxWidth) {
    var result = {
      width: 0,
      height: 1
    };
    var tokens = tokenize(str, maxWidth);
    var lineWidth = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      switch (token.type) {
        case TYPE_TEXT:
          lineWidth += token.value.length;
          break;

        case TYPE_NEWLINE:
          result.height++;
          result.width = Math.max(result.width, lineWidth);
          lineWidth = 0;
          break;
      }
    }

    result.width = Math.max(result.width, lineWidth);
    return result;
  }
  /**
   * Convert string to a series of a formatting commands
   */


  function tokenize(str, maxWidth) {
    var result = [];
    /* first tokenization pass - split texts and color formatting commands */

    var offset = 0;
    str.replace(RE_COLORS, function (match, type, name, index) {
      /* string before */
      var part = str.substring(offset, index);

      if (part.length) {
        result.push({
          type: TYPE_TEXT,
          value: part
        });
      }
      /* color command */


      result.push({
        type: type == "c" ? TYPE_FG : TYPE_BG,
        value: name.trim()
      });
      offset = index + match.length;
      return "";
    });
    /* last remaining part */

    var part = str.substring(offset);

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

    var i = 0;
    var lineLength = 0;
    var lastTokenWithSpace = -1;

    while (i < tokens.length) {
      /* take all text tokens, remove space, apply linebreaks */
      var token = tokens[i];

      if (token.type == TYPE_NEWLINE) {
        /* reset */
        lineLength = 0;
        lastTokenWithSpace = -1;
      }

      if (token.type != TYPE_TEXT) {
        /* skip non-text tokens */
        i++;
        continue;
      }
      /* remove spaces at the beginning of line */


      while (lineLength == 0 && token.value.charAt(0) == " ") {
        token.value = token.value.substring(1);
      }
      /* forced newline? insert two new tokens after this one */


      var _index2 = token.value.indexOf("\n");

      if (_index2 != -1) {
        token.value = breakInsideToken(tokens, i, _index2, true);
        /* if there are spaces at the end, we must remove them (we do not want the line too long) */

        var arr = token.value.split("");

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

      if (lineLength + token.value.length > maxWidth) {
        /* line too long, find a suitable breaking spot */

        /* is it possible to break within this token? */
        var _index3 = -1;

        while (1) {
          var nextIndex = token.value.indexOf(" ", _index3 + 1);

          if (nextIndex == -1) {
            break;
          }

          if (lineLength + nextIndex > maxWidth) {
            break;
          }

          _index3 = nextIndex;
        }

        if (_index3 != -1) {
          /* break at space within this one */
          token.value = breakInsideToken(tokens, i, _index3, true);
        } else if (lastTokenWithSpace != -1) {
          /* is there a previous token where a break can occur? */
          var _token = tokens[lastTokenWithSpace];

          var breakIndex = _token.value.lastIndexOf(" ");

          _token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
          i = lastTokenWithSpace;
        } else {
          /* force break in this token */
          token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
        }
      } else {
        /* line not long, continue */
        lineLength += token.value.length;

        if (token.value.indexOf(" ") != -1) {
          lastTokenWithSpace = i;
        }
      }

      i++;
      /* advance to next token */
    }

    tokens.push({
      type: TYPE_NEWLINE
    });
    /* insert fake newline to fix the last text line */

    /* remove trailing space from text tokens before newlines */

    var lastTextToken = null;

    for (var _i2 = 0; _i2 < tokens.length; _i2++) {
      var _token2 = tokens[_i2];

      switch (_token2.type) {
        case TYPE_TEXT:
          lastTextToken = _token2;
          break;

        case TYPE_NEWLINE:
          if (lastTextToken) {
            /* remove trailing space */
            var _arr2 = lastTextToken.value.split("");

            while (_arr2.length && _arr2[_arr2.length - 1] == " ") {
              _arr2.pop();
            }

            lastTextToken.value = _arr2.join("");
          }

          lastTextToken = null;
          break;
      }
    }

    tokens.pop();
    /* remove fake token */

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

  var text =
  /*#__PURE__*/
  Object.freeze({
    TYPE_TEXT: TYPE_TEXT,
    TYPE_NEWLINE: TYPE_NEWLINE,
    TYPE_FG: TYPE_FG,
    TYPE_BG: TYPE_BG,
    measure: measure,
    tokenize: tokenize
  });
  /** Default with for display and map generators */

  var DEFAULT_WIDTH = 80;
  /** Default height for display and map generators */

  var DEFAULT_HEIGHT = 25;
  var DIRS = {
    4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
  };
  var KEYS = {
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

  var Display =
  /*#__PURE__*/
  function () {
    function Display() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Display);

      var canvas = document.createElement("canvas");
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


    _createClass(Display, [{
      key: "DEBUG",
      value: function DEBUG(x, y, what) {
        var colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
      }
      /**
       * Clear the whole display (cover it with background color)
       */

    }, {
      key: "clear",
      value: function clear() {
        this._data = {};
        this._dirty = true;
      }
      /**
       * @see ROT.Display
       */

    }, {
      key: "setOptions",
      value: function setOptions(options) {
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
      }
      /**
       * Returns currently set options
       * @returns {object} Current options object
       */

    }, {
      key: "getOptions",
      value: function getOptions() {
        return this._options;
      }
      /**
       * Returns the DOM node of this display
       * @returns {node} DOM node
       */

    }, {
      key: "getContainer",
      value: function getContainer() {
        return this._context.canvas;
      }
      /**
       * Compute the maximum width/height to fit into a set of given constraints
       * @param {int} availWidth Maximum allowed pixel width
       * @param {int} availHeight Maximum allowed pixel height
       * @returns {int[2]} cellWidth,cellHeight
       */

    }, {
      key: "computeSize",
      value: function computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
      }
      /**
       * Compute the maximum font size to fit into a set of given constraints
       * @param {int} availWidth Maximum allowed pixel width
       * @param {int} availHeight Maximum allowed pixel height
       * @returns {int} fontSize
       */

    }, {
      key: "computeFontSize",
      value: function computeFontSize(availWidth, availHeight) {
        return this._backend.computeFontSize(availWidth, availHeight);
      }
    }, {
      key: "computeTileSize",
      value: function computeTileSize(availWidth, availHeight) {
        var width = Math.floor(availWidth / this._options.width);
        var height = Math.floor(availHeight / this._options.height);
        return [width, height];
      }
      /**
       * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
       * @param {Event} e event
       * @returns {int[2]} -1 for values outside of the canvas
       */

    }, {
      key: "eventToPosition",
      value: function eventToPosition(e) {
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
      }
      /**
       * @param {int} x
       * @param {int} y
       * @param {string || string[]} ch One or more chars (will be overlapping themselves)
       * @param {string} [fg] foreground color
       * @param {string} [bg] background color
       */

    }, {
      key: "draw",
      value: function draw(x, y, ch, fg, bg) {
        if (!fg) {
          fg = this._options.fg;
        }

        if (!bg) {
          bg = this._options.bg;
        }

        var key = "".concat(x, ",").concat(y);
        this._data[key] = [x, y, ch, fg, bg];

        if (this._dirty === true) {
          return;
        }
        /* will already redraw everything */


        if (!this._dirty) {
          this._dirty = {};
        }
        /* first! */


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

    }, {
      key: "drawText",
      value: function drawText(x, y, text, maxWidth) {
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
          /* interpret tokenized opcode stream */
          var token = tokens.shift();

          switch (token.type) {
            case TYPE_TEXT:
              var isSpace = false,
                  isPrevSpace = false,
                  isFullWidth = false,
                  isPrevFullWidth = false;

              for (var i = 0; i < token.value.length; i++) {
                var cc = token.value.charCodeAt(i);
                var c = token.value.charAt(i); // Assign to `true` when the current char is full-width.

                isFullWidth = cc > 0xff00 && cc < 0xff61 || cc > 0xffdc && cc < 0xffe8 || cc > 0xffee; // Current char is space, whatever full-width or half-width both are OK.

                isSpace = c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000; // The previous char is full-width and
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

    }, {
      key: "_tick",
      value: function _tick() {
        requestAnimationFrame(this._tick);

        if (!this._dirty) {
          return;
        }

        if (this._dirty === true) {
          // draw all
          this._context.fillStyle = this._options.bg;

          this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

          for (var id in this._data) {
            this._draw(id, false);
          } // redraw cached data 

        } else {
          // draw only dirty 
          for (var key in this._dirty) {
            this._draw(key, true);
          }
        }

        this._dirty = false;
      }
      /**
       * @param {string} key What to draw
       * @param {bool} clearBefore Is it necessary to clean before?
       */

    }, {
      key: "_draw",
      value: function _draw(key, clearBefore) {
        var data = this._data[key];

        if (data[4] != this._options.bg) {
          clearBefore = true;
        }

        this._backend.draw(data, clearBefore);
      }
    }]);

    return Display;
  }();

  Display.Rect = Rect;
  Display.Hex = Hex;
  Display.Tile = Tile;
  /**
   * @class (Markov process)-based string generator.
   * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
   * Offers configurable order and prior.
   */

  var StringGenerator =
  /*#__PURE__*/
  function () {
    function StringGenerator(options) {
      _classCallCheck(this, StringGenerator);

      this._options = {
        words: false,
        order: 3,
        prior: 0.001
      };
      Object.assign(this._options, options);
      this._boundary = String.fromCharCode(0);
      this._suffix = this._boundary;
      this._prefix = [];

      for (var i = 0; i < this._options.order; i++) {
        this._prefix.push(this._boundary);
      }

      this._priorValues = {};
      this._priorValues[this._boundary] = this._options.prior;
      this._data = {};
    }
    /**
     * Remove all learning data
     */


    _createClass(StringGenerator, [{
      key: "clear",
      value: function clear() {
        this._data = {};
        this._priorValues = {};
      }
      /**
       * @returns {string} Generated string
       */

    }, {
      key: "generate",
      value: function generate() {
        var result = [this._sample(this._prefix)];

        while (result[result.length - 1] != this._boundary) {
          result.push(this._sample(result));
        }

        return this._join(result.slice(0, -1));
      }
      /**
       * Observe (learn) a string from a training set
       */

    }, {
      key: "observe",
      value: function observe(string) {
        var tokens = this._split(string);

        for (var i = 0; i < tokens.length; i++) {
          this._priorValues[tokens[i]] = this._options.prior;
        }

        tokens = this._prefix.concat(tokens).concat(this._suffix);
        /* add boundary symbols */

        for (var _i3 = this._options.order; _i3 < tokens.length; _i3++) {
          var context = tokens.slice(_i3 - this._options.order, _i3);
          var event = tokens[_i3];

          for (var j = 0; j < context.length; j++) {
            var subcontext = context.slice(j);

            this._observeEvent(subcontext, event);
          }
        }
      }
    }, {
      key: "getStats",
      value: function getStats() {
        var parts = [];
        var priorCount = Object.keys(this._priorValues).length;
        priorCount--; // boundary

        parts.push("distinct samples: " + priorCount);
        var dataCount = Object.keys(this._data).length;
        var eventCount = 0;

        for (var p in this._data) {
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

    }, {
      key: "_split",
      value: function _split(str) {
        return str.split(this._options.words ? /\s+/ : "");
      }
      /**
       * @param {string[]}
       * @returns {string}
       */

    }, {
      key: "_join",
      value: function _join(arr) {
        return arr.join(this._options.words ? " " : "");
      }
      /**
       * @param {string[]} context
       * @param {string} event
       */

    }, {
      key: "_observeEvent",
      value: function _observeEvent(context, event) {
        var key = this._join(context);

        if (!(key in this._data)) {
          this._data[key] = {};
        }

        var data = this._data[key];

        if (!(event in data)) {
          data[event] = 0;
        }

        data[event]++;
      }
      /**
       * @param {string[]}
       * @returns {string}
       */

    }, {
      key: "_sample",
      value: function _sample(context) {
        context = this._backoff(context);

        var key = this._join(context);

        var data = this._data[key];
        var available = {};

        if (this._options.prior) {
          for (var event in this._priorValues) {
            available[event] = this._priorValues[event];
          }

          for (var _event in data) {
            available[_event] += data[_event];
          }
        } else {
          available = data;
        }

        return RNG$1.getWeightedValue(available);
      }
      /**
       * @param {string[]}
       * @returns {string[]}
       */

    }, {
      key: "_backoff",
      value: function _backoff(context) {
        if (context.length > this._options.order) {
          context = context.slice(-this._options.order);
        } else if (context.length < this._options.order) {
          context = this._prefix.slice(0, this._options.order - context.length).concat(context);
        }

        while (!(this._join(context) in this._data) && context.length > 0) {
          context = context.slice(1);
        }

        return context;
      }
    }]);

    return StringGenerator;
  }();

  var EventQueue =
  /*#__PURE__*/
  function () {
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    function EventQueue() {
      _classCallCheck(this, EventQueue);

      this._time = 0;
      this._events = [];
      this._eventTimes = [];
    }
    /**
     * @returns {number} Elapsed time
     */


    _createClass(EventQueue, [{
      key: "getTime",
      value: function getTime() {
        return this._time;
      }
      /**
       * Clear all scheduled events
       */

    }, {
      key: "clear",
      value: function clear() {
        this._events = [];
        this._eventTimes = [];
        return this;
      }
      /**
       * @param {?} event
       * @param {number} time
       */

    }, {
      key: "add",
      value: function add(event, time) {
        var index = this._events.length;

        for (var i = 0; i < this._eventTimes.length; i++) {
          if (this._eventTimes[i] > time) {
            index = i;
            break;
          }
        }

        this._events.splice(index, 0, event);

        this._eventTimes.splice(index, 0, time);
      }
      /**
       * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
       * @returns {? || null} The event previously added by addEvent, null if no event available
       */

    }, {
      key: "get",
      value: function get() {
        if (!this._events.length) {
          return null;
        }

        var time = this._eventTimes.splice(0, 1)[0];

        if (time > 0) {
          /* advance */
          this._time += time;

          for (var i = 0; i < this._eventTimes.length; i++) {
            this._eventTimes[i] -= time;
          }
        }

        return this._events.splice(0, 1)[0];
      }
      /**
       * Get the time associated with the given event
       * @param {?} event
       * @returns {number} time
       */

    }, {
      key: "getEventTime",
      value: function getEventTime(event) {
        var index = this._events.indexOf(event);

        if (index == -1) {
          return undefined;
        }

        return this._eventTimes[index];
      }
      /**
       * Remove an event from the queue
       * @param {?} event
       * @returns {bool} success?
       */

    }, {
      key: "remove",
      value: function remove(event) {
        var index = this._events.indexOf(event);

        if (index == -1) {
          return false;
        }

        this._remove(index);

        return true;
      }
    }, {
      key: "_remove",

      /**
       * Remove an event from the queue
       * @param {int} index
       */
      value: function _remove(index) {
        this._events.splice(index, 1);

        this._eventTimes.splice(index, 1);
      }
    }]);

    return EventQueue;
  }();

  var Scheduler =
  /*#__PURE__*/
  function () {
    /**
     * @class Abstract scheduler
     */
    function Scheduler() {
      _classCallCheck(this, Scheduler);

      this._queue = new EventQueue();
      this._repeat = [];
      this._current = null;
    }
    /**
     * @see ROT.EventQueue#getTime
     */


    _createClass(Scheduler, [{
      key: "getTime",
      value: function getTime() {
        return this._queue.getTime();
      }
      /**
       * @param {?} item
       * @param {bool} repeat
       */

    }, {
      key: "add",
      value: function add(item, repeat) {
        if (repeat) {
          this._repeat.push(item);
        }

        return this;
      }
      /**
       * Get the time the given item is scheduled for
       * @param {?} item
       * @returns {number} time
       */

    }, {
      key: "getTimeOf",
      value: function getTimeOf(item) {
        return this._queue.getEventTime(item);
      }
      /**
       * Clear all items
       */

    }, {
      key: "clear",
      value: function clear() {
        this._queue.clear();

        this._repeat = [];
        this._current = null;
        return this;
      }
      /**
       * Remove a previously added item
       * @param {?} item
       * @returns {bool} successful?
       */

    }, {
      key: "remove",
      value: function remove(item) {
        var result = this._queue.remove(item);

        var index = this._repeat.indexOf(item);

        if (index != -1) {
          this._repeat.splice(index, 1);
        }

        if (this._current == item) {
          this._current = null;
        }

        return result;
      }
      /**
       * Schedule next item
       * @returns {?}
       */

    }, {
      key: "next",
      value: function next() {
        this._current = this._queue.get();
        return this._current;
      }
    }]);

    return Scheduler;
  }();
  /**
   * @class Simple fair scheduler (round-robin style)
   */


  var Simple =
  /*#__PURE__*/
  function (_Scheduler) {
    _inherits(Simple, _Scheduler);

    function Simple() {
      _classCallCheck(this, Simple);

      return _possibleConstructorReturn(this, _getPrototypeOf(Simple).apply(this, arguments));
    }

    _createClass(Simple, [{
      key: "add",
      value: function add(item, repeat) {
        this._queue.add(item, 0);

        return _get(_getPrototypeOf(Simple.prototype), "add", this).call(this, item, repeat);
      }
    }, {
      key: "next",
      value: function next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
          this._queue.add(this._current, 0);
        }

        return _get(_getPrototypeOf(Simple.prototype), "next", this).call(this);
      }
    }]);

    return Simple;
  }(Scheduler);
  /**
   * @class Speed-based scheduler
   */


  var Speed =
  /*#__PURE__*/
  function (_Scheduler2) {
    _inherits(Speed, _Scheduler2);

    function Speed() {
      _classCallCheck(this, Speed);

      return _possibleConstructorReturn(this, _getPrototypeOf(Speed).apply(this, arguments));
    }

    _createClass(Speed, [{
      key: "add",

      /**
       * @param {object} item anything with "getSpeed" method
       * @param {bool} repeat
       * @param {number} [time=1/item.getSpeed()]
       * @see ROT.Scheduler#add
       */
      value: function add(item, repeat, time) {
        this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());

        return _get(_getPrototypeOf(Speed.prototype), "add", this).call(this, item, repeat);
      }
      /**
       * @see ROT.Scheduler#next
       */

    }, {
      key: "next",
      value: function next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
          this._queue.add(this._current, 1 / this._current.getSpeed());
        }

        return _get(_getPrototypeOf(Speed.prototype), "next", this).call(this);
      }
    }]);

    return Speed;
  }(Scheduler);
  /**
   * @class Action-based scheduler
   * @augments ROT.Scheduler
   */


  var Action =
  /*#__PURE__*/
  function (_Scheduler3) {
    _inherits(Action, _Scheduler3);

    function Action() {
      var _this4;

      _classCallCheck(this, Action);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Action).call(this));
      _this4._defaultDuration = 1;
      /* for newly added */

      _this4._duration = _this4._defaultDuration;
      /* for this._current */

      return _this4;
    }
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */


    _createClass(Action, [{
      key: "add",
      value: function add(item, repeat, time) {
        this._queue.add(item, time || this._defaultDuration);

        return _get(_getPrototypeOf(Action.prototype), "add", this).call(this, item, repeat);
      }
    }, {
      key: "clear",
      value: function clear() {
        this._duration = this._defaultDuration;
        return _get(_getPrototypeOf(Action.prototype), "clear", this).call(this);
      }
    }, {
      key: "remove",
      value: function remove(item) {
        if (item == this._current) {
          this._duration = this._defaultDuration;
        }

        return _get(_getPrototypeOf(Action.prototype), "remove", this).call(this, item);
      }
      /**
       * @see ROT.Scheduler#next
       */

    }, {
      key: "next",
      value: function next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
          this._queue.add(this._current, this._duration || this._defaultDuration);

          this._duration = this._defaultDuration;
        }

        return _get(_getPrototypeOf(Action.prototype), "next", this).call(this);
      }
      /**
       * Set duration for the active item
       */

    }, {
      key: "setDuration",
      value: function setDuration(time) {
        if (this._current) {
          this._duration = time;
        }

        return this;
      }
    }]);

    return Action;
  }(Scheduler);

  var index = {
    Simple: Simple,
    Speed: Speed,
    Action: Action
  };

  var FOV =
  /*#__PURE__*/
  function () {
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    function FOV(lightPassesCallback) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, FOV);

      this._lightPasses = lightPassesCallback;
      this._options = Object.assign({
        topology: 8
      }, options);
    }
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */


    _createClass(FOV, [{
      key: "_getCircle",
      value: function _getCircle(cx, cy, r) {
        var result = [];
        var dirs, countFactor, startOffset;

        switch (this._options.topology) {
          case 4:
            countFactor = 1;
            startOffset = [0, 1];
            dirs = [DIRS[8][7], DIRS[8][1], DIRS[8][3], DIRS[8][5]];
            break;

          case 6:
            dirs = DIRS[6];
            countFactor = 1;
            startOffset = [-1, 1];
            break;

          case 8:
            dirs = DIRS[4];
            countFactor = 2;
            startOffset = [-1, 1];
            break;

          default:
            throw new Error("Incorrect topology for FOV computation");
            break;
        }
        /* starting neighbor */


        var x = cx + startOffset[0] * r;
        var y = cy + startOffset[1] * r;
        /* circle */

        for (var i = 0; i < dirs.length; i++) {
          for (var j = 0; j < r * countFactor; j++) {
            result.push([x, y]);
            x += dirs[i][0];
            y += dirs[i][1];
          }
        }

        return result;
      }
    }]);

    return FOV;
  }();
  /**
   * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
   * @augments ROT.FOV
   */


  var DiscreteShadowcasting =
  /*#__PURE__*/
  function (_FOV) {
    _inherits(DiscreteShadowcasting, _FOV);

    function DiscreteShadowcasting() {
      _classCallCheck(this, DiscreteShadowcasting);

      return _possibleConstructorReturn(this, _getPrototypeOf(DiscreteShadowcasting).apply(this, arguments));
    }

    _createClass(DiscreteShadowcasting, [{
      key: "compute",
      value: function compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */

        if (!this._lightPasses(x, y)) {
          return;
        }
        /* start and end angles */


        var DATA = [];
        var A, B, cx, cy, blocks;
        /* analyze surrounding cells in concentric rings, starting from the center */

        for (var r = 1; r <= R; r++) {
          var neighbors = this._getCircle(x, y, r);

          var angle = 360 / neighbors.length;

          for (var i = 0; i < neighbors.length; i++) {
            cx = neighbors[i][0];
            cy = neighbors[i][1];
            A = angle * (i - 0.5);
            B = A + angle;
            blocks = !this._lightPasses(cx, cy);

            if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
              callback(cx, cy, r, 1);
            }

            if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
              return;
            }
            /* cutoff? */

          }
          /* for all cells in this ring */

        }
        /* for all rings */

      }
      /**
       * @param {int} A start angle
       * @param {int} B end angle
       * @param {bool} blocks Does current cell block visibility?
       * @param {int[][]} DATA shadowed angle pairs
       */

    }, {
      key: "_visibleCoords",
      value: function _visibleCoords(A, B, blocks, DATA) {
        if (A < 0) {
          var v1 = this._visibleCoords(0, B, blocks, DATA);

          var v2 = this._visibleCoords(360 + A, 360, blocks, DATA);

          return v1 || v2;
        }

        var index = 0;

        while (index < DATA.length && DATA[index] < A) {
          index++;
        }

        if (index == DATA.length) {
          /* completely new shadow */
          if (blocks) {
            DATA.push(A, B);
          }

          return true;
        }

        var count = 0;

        if (index % 2) {
          /* this shadow starts in an existing shadow, or within its ending boundary */
          while (index < DATA.length && DATA[index] < B) {
            index++;
            count++;
          }

          if (count == 0) {
            return false;
          }

          if (blocks) {
            if (count % 2) {
              DATA.splice(index - count, count, B);
            } else {
              DATA.splice(index - count, count);
            }
          }

          return true;
        } else {
          /* this shadow starts outside an existing shadow, or within a starting boundary */
          while (index < DATA.length && DATA[index] < B) {
            index++;
            count++;
          }
          /* visible when outside an existing shadow, or when overlapping */


          if (A == DATA[index - count] && count == 1) {
            return false;
          }

          if (blocks) {
            if (count % 2) {
              DATA.splice(index - count, count, A);
            } else {
              DATA.splice(index - count, count, A, B);
            }
          }

          return true;
        }
      }
    }]);

    return DiscreteShadowcasting;
  }(FOV);
  /**
   * @class Precise shadowcasting algorithm
   * @augments ROT.FOV
   */


  var PreciseShadowcasting =
  /*#__PURE__*/
  function (_FOV2) {
    _inherits(PreciseShadowcasting, _FOV2);

    function PreciseShadowcasting() {
      _classCallCheck(this, PreciseShadowcasting);

      return _possibleConstructorReturn(this, _getPrototypeOf(PreciseShadowcasting).apply(this, arguments));
    }

    _createClass(PreciseShadowcasting, [{
      key: "compute",
      value: function compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */

        if (!this._lightPasses(x, y)) {
          return;
        }
        /* list of all shadows */


        var SHADOWS = [];
        var cx, cy, blocks, A1, A2, visibility;
        /* analyze surrounding cells in concentric rings, starting from the center */

        for (var r = 1; r <= R; r++) {
          var neighbors = this._getCircle(x, y, r);

          var neighborCount = neighbors.length;

          for (var i = 0; i < neighborCount; i++) {
            cx = neighbors[i][0];
            cy = neighbors[i][1];
            /* shift half-an-angle backwards to maintain consistency of 0-th cells */

            A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
            A2 = [2 * i + 1, 2 * neighborCount];
            blocks = !this._lightPasses(cx, cy);
            visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);

            if (visibility) {
              callback(cx, cy, r, visibility);
            }

            if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
              return;
            }
            /* cutoff? */

          }
          /* for all cells in this ring */

        }
        /* for all rings */

      }
      /**
       * @param {int[2]} A1 arc start
       * @param {int[2]} A2 arc end
       * @param {bool} blocks Does current arc block visibility?
       * @param {int[][]} SHADOWS list of active shadows
       */

    }, {
      key: "_checkVisibility",
      value: function _checkVisibility(A1, A2, blocks, SHADOWS) {
        if (A1[0] > A2[0]) {
          /* split into two sub-arcs */
          var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);

          var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);

          return (v1 + v2) / 2;
        }
        /* index1: first shadow >= A1 */


        var index1 = 0,
            edge1 = false;

        while (index1 < SHADOWS.length) {
          var old = SHADOWS[index1];
          var diff = old[0] * A1[1] - A1[0] * old[1];

          if (diff >= 0) {
            /* old >= A1 */
            if (diff == 0 && !(index1 % 2)) {
              edge1 = true;
            }

            break;
          }

          index1++;
        }
        /* index2: last shadow <= A2 */


        var index2 = SHADOWS.length,
            edge2 = false;

        while (index2--) {
          var _old = SHADOWS[index2];

          var _diff = A2[0] * _old[1] - _old[0] * A2[1];

          if (_diff >= 0) {
            /* old <= A2 */
            if (_diff == 0 && index2 % 2) {
              edge2 = true;
            }

            break;
          }
        }

        var visible = true;

        if (index1 == index2 && (edge1 || edge2)) {
          /* subset of existing shadow, one of the edges match */
          visible = false;
        } else if (edge1 && edge2 && index1 + 1 == index2 && index2 % 2) {
          /* completely equivalent with existing shadow */
          visible = false;
        } else if (index1 > index2 && index1 % 2) {
          /* subset of existing shadow, not touching */
          visible = false;
        }

        if (!visible) {
          return 0;
        }
        /* fast case: not visible */


        var visibleLength;
        /* compute the length of visible arc, adjust list of shadows (if blocking) */

        var remove = index2 - index1 + 1;

        if (remove % 2) {
          if (index1 % 2) {
            /* first edge within existing shadow, second outside */
            var P = SHADOWS[index1];
            visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);

            if (blocks) {
              SHADOWS.splice(index1, remove, A2);
            }
          } else {
            /* second edge within existing shadow, first outside */
            var _P = SHADOWS[index2];
            visibleLength = (_P[0] * A1[1] - A1[0] * _P[1]) / (A1[1] * _P[1]);

            if (blocks) {
              SHADOWS.splice(index1, remove, A1);
            }
          }
        } else {
          if (index1 % 2) {
            /* both edges within existing shadows */
            var P1 = SHADOWS[index1];
            var P2 = SHADOWS[index2];
            visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);

            if (blocks) {
              SHADOWS.splice(index1, remove);
            }
          } else {
            /* both edges outside existing shadows */
            if (blocks) {
              SHADOWS.splice(index1, remove, A1, A2);
            }

            return 1;
            /* whole arc visible! */
          }
        }

        var arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
        return visibleLength / arcLength;
      }
    }]);

    return PreciseShadowcasting;
  }(FOV);
  /** Octants used for translating recursive shadowcasting offsets */


  var OCTANTS = [[-1, 0, 0, 1], [0, -1, 1, 0], [0, -1, -1, 0], [-1, 0, 0, -1], [1, 0, 0, -1], [0, 1, -1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];
  /**
   * @class Recursive shadowcasting algorithm
   * Currently only supports 4/8 topologies, not hexagonal.
   * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
   * @augments ROT.FOV
   */

  var RecursiveShadowcasting =
  /*#__PURE__*/
  function (_FOV3) {
    _inherits(RecursiveShadowcasting, _FOV3);

    function RecursiveShadowcasting() {
      _classCallCheck(this, RecursiveShadowcasting);

      return _possibleConstructorReturn(this, _getPrototypeOf(RecursiveShadowcasting).apply(this, arguments));
    }

    _createClass(RecursiveShadowcasting, [{
      key: "compute",

      /**
       * Compute visibility for a 360-degree circle
       * @param {int} x
       * @param {int} y
       * @param {int} R Maximum visibility radius
       * @param {function} callback
       */
      value: function compute(x, y, R, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);

        for (var i = 0; i < OCTANTS.length; i++) {
          this._renderOctant(x, y, OCTANTS[i], R, callback);
        }
      }
      /**
       * Compute visibility for a 180-degree arc
       * @param {int} x
       * @param {int} y
       * @param {int} R Maximum visibility radius
       * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
       * @param {function} callback
       */

    }, {
      key: "compute180",
      value: function compute180(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees

        var nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees

        var nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees

        this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);

        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);

        this._renderOctant(x, y, OCTANTS[dir], R, callback);

        this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
      }
    }, {
      key: "compute90",

      /**
       * Compute visibility for a 90-degree arc
       * @param {int} x
       * @param {int} y
       * @param {int} R Maximum visibility radius
       * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
       * @param {function} callback
       */
      value: function compute90(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees

        this._renderOctant(x, y, OCTANTS[dir], R, callback);

        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
      }
      /**
       * Render one octant (45-degree arc) of the viewshed
       * @param {int} x
       * @param {int} y
       * @param {int} octant Octant to be rendered
       * @param {int} R Maximum visibility radius
       * @param {function} callback
       */

    }, {
      key: "_renderOctant",
      value: function _renderOctant(x, y, octant, R, callback) {
        //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
        this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
      }
      /**
       * Actually calculates the visibility
       * @param {int} startX The starting X coordinate
       * @param {int} startY The starting Y coordinate
       * @param {int} row The row to render
       * @param {float} visSlopeStart The slope to start at
       * @param {float} visSlopeEnd The slope to end at
       * @param {int} radius The radius to reach out to
       * @param {int} xx
       * @param {int} xy
       * @param {int} yx
       * @param {int} yy
       * @param {function} callback The callback to use when we hit a block that is visible
       */

    }, {
      key: "_castVisibility",
      value: function _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
        if (visSlopeStart < visSlopeEnd) {
          return;
        }

        for (var i = row; i <= radius; i++) {
          var dx = -i - 1;
          var dy = -i;
          var blocked = false;
          var newStart = 0; //'Row' could be column, names here assume octant 0 and would be flipped for half the octants

          while (dx <= 0) {
            dx += 1; //Translate from relative coordinates to map coordinates

            var mapX = startX + dx * xx + dy * xy;
            var mapY = startY + dx * yx + dy * yy; //Range of the row

            var slopeStart = (dx - 0.5) / (dy + 0.5);
            var slopeEnd = (dx + 0.5) / (dy - 0.5); //Ignore if not yet at left edge of Octant

            if (slopeEnd > visSlopeStart) {
              continue;
            } //Done if past right edge


            if (slopeStart < visSlopeEnd) {
              break;
            } //If it's in range, it's visible


            if (dx * dx + dy * dy < radius * radius) {
              callback(mapX, mapY, i, 1);
            }

            if (!blocked) {
              //If tile is a blocking tile, cast around it
              if (!this._lightPasses(mapX, mapY) && i < radius) {
                blocked = true;

                this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);

                newStart = slopeEnd;
              }
            } else {
              //Keep narrowing if scanning across a block
              if (!this._lightPasses(mapX, mapY)) {
                newStart = slopeEnd;
                continue;
              } //Block has ended


              blocked = false;
              visSlopeStart = newStart;
            }
          }

          if (blocked) {
            break;
          }
        }
      }
    }]);

    return RecursiveShadowcasting;
  }(FOV);

  var index$1 = {
    DiscreteShadowcasting: DiscreteShadowcasting,
    PreciseShadowcasting: PreciseShadowcasting,
    RecursiveShadowcasting: RecursiveShadowcasting
  };

  var Map =
  /*#__PURE__*/
  function () {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    function Map() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_WIDTH;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_HEIGHT;

      _classCallCheck(this, Map);

      this._width = width;
      this._height = height;
    }

    _createClass(Map, [{
      key: "_fillMap",
      value: function _fillMap(value) {
        var map = [];

        for (var i = 0; i < this._width; i++) {
          map.push([]);

          for (var j = 0; j < this._height; j++) {
            map[i].push(value);
          }
        }

        return map;
      }
    }]);

    return Map;
  }();
  /**
   * @class Simple empty rectangular room
   * @augments ROT.Map
   */


  var Arena =
  /*#__PURE__*/
  function (_Map) {
    _inherits(Arena, _Map);

    function Arena() {
      _classCallCheck(this, Arena);

      return _possibleConstructorReturn(this, _getPrototypeOf(Arena).apply(this, arguments));
    }

    _createClass(Arena, [{
      key: "create",
      value: function create(callback) {
        var w = this._width - 1;
        var h = this._height - 1;

        for (var i = 0; i <= w; i++) {
          for (var j = 0; j <= h; j++) {
            var empty = i && j && i < w && j < h;
            callback(i, j, empty ? 0 : 1);
          }
        }

        return this;
      }
    }]);

    return Arena;
  }(Map);

  var index$2 = {
    Arena: Arena
  };
  /**
   * @class Asynchronous main loop
   * @param {ROT.Scheduler} scheduler
   */

  var Engine =
  /*#__PURE__*/
  function () {
    function Engine(scheduler) {
      _classCallCheck(this, Engine);

      this._scheduler = scheduler;
      this._lock = 1;
    }
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */


    _createClass(Engine, [{
      key: "start",
      value: function start() {
        return this.unlock();
      }
      /**
       * Interrupt the engine by an asynchronous action
       */

    }, {
      key: "lock",
      value: function lock() {
        this._lock++;
        return this;
      }
      /**
       * Resume execution (paused by a previous lock)
       */

    }, {
      key: "unlock",
      value: function unlock() {
        if (!this._lock) {
          throw new Error("Cannot unlock unlocked engine");
        }

        this._lock--;

        while (!this._lock) {
          var actor = this._scheduler.next();

          if (!actor) {
            return this.lock();
          }
          /* no actors */


          var result = actor.act();

          if (result && result.then) {
            /* actor returned a "thenable", looks like a Promise */
            this.lock();
            result.then(this.unlock.bind(this));
          }
        }

        return this;
      }
    }]);

    return Engine;
  }();

  function fromString(str) {
    var cached, r;

    if (str in CACHE) {
      cached = CACHE[str];
    } else {
      if (str.charAt(0) == "#") {
        // hex rgb
        var matched = str.match(/[0-9a-f]/gi) || [];
        var values = matched.map(function (x) {
          return parseInt(x, 16);
        });

        if (values.length == 3) {
          cached = values.map(function (x) {
            return x * 17;
          });
        } else {
          for (var i = 0; i < 3; i++) {
            values[i + 1] += 16 * values[i];
            values.splice(i, 1);
          }

          cached = values;
        }
      } else if (r = str.match(/rgb\(([0-9, ]+)\)/i)) {
        // decimal rgb
        cached = r[1].split(/\s*,\s*/).map(function (x) {
          return parseInt(x);
        });
      } else {
        // html name
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


  function add(color1) {
    var result = color1.slice();

    for (var _len2 = arguments.length, colors = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      colors[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
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


  function add_(color1) {
    for (var _len3 = arguments.length, colors = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      colors[_key3 - 1] = arguments[_key3];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
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


  function multiply(color1) {
    var result = color1.slice();

    for (var _len4 = arguments.length, colors = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      colors[_key4 - 1] = arguments[_key4];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
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


  function multiply_(color1) {
    for (var _len5 = arguments.length, colors = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      colors[_key5 - 1] = arguments[_key5];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
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


  function interpolate(color1, color2) {
    var factor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var result = color1.slice();

    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }

    return result;
  }

  var lerp = interpolate;
  /**
   * Interpolate (blend) two colors with a given factor in HSL mode
   * @param {number[]} color1
   * @param {number[]} color2
   * @param {float} [factor=0.5] 0..1
   * @returns {number[]}
   */

  function interpolateHSL(color1, color2) {
    var factor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var hsl1 = rgb2hsl(color1);
    var hsl2 = rgb2hsl(color2);

    for (var i = 0; i < 3; i++) {
      hsl1[i] += factor * (hsl2[i] - hsl1[i]);
    }

    return hsl2rgb(hsl1);
  }

  var lerpHSL = interpolateHSL;
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

    var result = color.slice();

    for (var i = 0; i < 3; i++) {
      result[i] += diff instanceof Array ? Math.round(RNG$1.getNormal(0, diff[i])) : diff;
    }

    return result;
  }
  /**
   * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
   * @param {number[]} color
   * @returns {number[]}
   */


  function rgb2hsl(color) {
    var r = color[0] / 255;
    var g = color[1] / 255;
    var b = color[2] / 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h = 0,
        s,
        l = (max + min) / 2;

    if (max == min) {
      s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

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
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  /**
   * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
   * @param {number[]} color
   * @returns {number[]}
   */


  function hsl2rgb(color) {
    var l = color[2];

    if (color[1] == 0) {
      l = Math.round(l * 255);
      return [l, l, l];
    } else {
      var s = color[1];
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      var r = hue2rgb(p, q, color[0] + 1 / 3);
      var g = hue2rgb(p, q, color[0]);
      var b = hue2rgb(p, q, color[0] - 1 / 3);
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
  }

  function toRGB(color) {
    var clamped = color.map(function (x) {
      return clamp(x, 0, 255);
    });
    return "rgb(".concat(clamped.join(","), ")");
  }

  function toHex(color) {
    var clamped = color.map(function (x) {
      return clamp(x, 0, 255).toString(16).padStart(2, "0");
    });
    return "#".concat(clamped.join(""));
  }

  var CACHE = {
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
  var color =
  /*#__PURE__*/
  Object.freeze({
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

  var Lighting =
  /*#__PURE__*/
  function () {
    /**
     * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
     * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
     * @param {object} [options]
     * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a *highly simplified* radiosity-like algorithm.
     * @param {int} [options.emissionThreshold=100] Cells with emissivity > threshold will be treated as light source in the next pass.
     * @param {int} [options.range=10] Max light range
     */
    function Lighting(reflectivityCallback) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Lighting);

      this._reflectivityCallback = reflectivityCallback;
      options = Object.assign({
        passes: 1,
        emissionThreshold: 100,
        range: 10
      }, options);
      this._lights = {};
      this._reflectivityCache = {};
      this._fovCache = {};
      this.setOptions(options);
    }
    /**
     * Adjust options at runtime
     * @see ROT.Lighting
     * @param {object} [options]
     */


    _createClass(Lighting, [{
      key: "setOptions",
      value: function setOptions(options) {
        Object.assign(this._options, options);

        if (options && options.range) {
          this.reset();
        }

        return this;
      }
      /**
       * Set the used Field-Of-View algo
       * @param {ROT.FOV} fov
       */

    }, {
      key: "setFOV",
      value: function setFOV(fov) {
        this._fov = fov;
        this._fovCache = {};
        return this;
      }
      /**
       * Set (or remove) a light source
       * @param {int} x
       * @param {int} y
       * @param {null || string || number[3]} color
       */

    }, {
      key: "setLight",
      value: function setLight(x, y, color) {
        var key = x + "," + y;

        if (color) {
          this._lights[key] = typeof color == "string" ? fromString(color) : color;
        } else {
          delete this._lights[key];
        }

        return this;
      }
      /**
       * Remove all light sources
       */

    }, {
      key: "clearLights",
      value: function clearLights() {
        this._lights = {};
      }
      /**
       * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
       */

    }, {
      key: "reset",
      value: function reset() {
        this._reflectivityCache = {};
        this._fovCache = {};
        return this;
      }
      /**
       * Compute the lighting
       * @param {function} lightingCallback Will be called with (x, y, color) for every lit cell
       */

    }, {
      key: "compute",
      value: function compute(lightingCallback) {
        var doneCells = {};
        var emittingCells = {};
        var litCells = {};

        for (var key in this._lights) {
          /* prepare emitters for first pass */
          var light = this._lights[key];
          emittingCells[key] = [0, 0, 0];
          add_(emittingCells[key], light);
        }

        for (var i = 0; i < this._options.passes; i++) {
          /* main loop */
          this._emitLight(emittingCells, litCells, doneCells);

          if (i + 1 == this._options.passes) {
            continue;
          }
          /* not for the last pass */


          emittingCells = this._computeEmitters(litCells, doneCells);
        }

        for (var litKey in litCells) {
          /* let the user know what and how is lit */
          var parts = litKey.split(",");
          var x = parseInt(parts[0]);
          var y = parseInt(parts[1]);
          lightingCallback(x, y, litCells[litKey]);
        }

        return this;
      }
      /**
       * Compute one iteration from all emitting cells
       * @param {object} emittingCells These emit light
       * @param {object} litCells Add projected light to these
       * @param {object} doneCells These already emitted, forbid them from further calculations
       */

    }, {
      key: "_emitLight",
      value: function _emitLight(emittingCells, litCells, doneCells) {
        for (var key in emittingCells) {
          var parts = key.split(",");
          var x = parseInt(parts[0]);
          var y = parseInt(parts[1]);

          this._emitLightFromCell(x, y, emittingCells[key], litCells);

          doneCells[key] = 1;
        }

        return this;
      }
      /**
       * Prepare a list of emitters for next pass
       * @param {object} litCells
       * @param {object} doneCells
       * @returns {object}
       */

    }, {
      key: "_computeEmitters",
      value: function _computeEmitters(litCells, doneCells) {
        var result = {};

        for (var key in litCells) {
          if (key in doneCells) {
            continue;
          }
          /* already emitted */


          var _color = litCells[key];
          var reflectivity = void 0;

          if (key in this._reflectivityCache) {
            reflectivity = this._reflectivityCache[key];
          } else {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            reflectivity = this._reflectivityCallback(x, y);
            this._reflectivityCache[key] = reflectivity;
          }

          if (reflectivity == 0) {
            continue;
          }
          /* will not reflect at all */

          /* compute emission color */


          var emission = [0, 0, 0];
          var intensity = 0;

          for (var i = 0; i < 3; i++) {
            var part = Math.round(_color[i] * reflectivity);
            emission[i] = part;
            intensity += part;
          }

          if (intensity > this._options.emissionThreshold) {
            result[key] = emission;
          }
        }

        return result;
      }
      /**
       * Compute one iteration from one cell
       * @param {int} x
       * @param {int} y
       * @param {number[]} color
       * @param {object} litCells Cell data to by updated
       */

    }, {
      key: "_emitLightFromCell",
      value: function _emitLightFromCell(x, y, color, litCells) {
        var key = x + "," + y;
        var fov;

        if (key in this._fovCache) {
          fov = this._fovCache[key];
        } else {
          fov = this._updateFOV(x, y);
        }

        for (var fovKey in fov) {
          var formFactor = fov[fovKey];
          var result = void 0;

          if (fovKey in litCells) {
            /* already lit */
            result = litCells[fovKey];
          } else {
            /* newly lit */
            result = [0, 0, 0];
            litCells[fovKey] = result;
          }

          for (var i = 0; i < 3; i++) {
            result[i] += Math.round(color[i] * formFactor);
          }
          /* add light color */

        }

        return this;
      }
      /**
       * Compute FOV ("form factor") for a potential light source at [x,y]
       * @param {int} x
       * @param {int} y
       * @returns {object}
       */

    }, {
      key: "_updateFOV",
      value: function _updateFOV(x, y) {
        var key1 = x + "," + y;
        var cache = {};
        this._fovCache[key1] = cache;
        var range = this._options.range;

        function cb(x, y, r, vis) {
          var key2 = x + "," + y;
          var formFactor = vis * (1 - r / range);

          if (formFactor == 0) {
            return;
          }

          cache[key2] = formFactor;
        }

        this._fov.compute(x, y, range, cb.bind(this));

        return cache;
      }
    }]);

    return Lighting;
  }();

  var Util = util;
  var Color = color;
  var Text = text;
  exports.Util = Util;
  exports.Color = Color;
  exports.Text = Text;
  exports.RNG = RNG$1;
  exports.Display = Display;
  exports.StringGenerator = StringGenerator;
  exports.EventQueue = EventQueue;
  exports.Scheduler = index;
  exports.FOV = index$1;
  exports.Map = index$2;
  exports.Engine = Engine;
  exports.Lighting = Lighting;
  exports.DEFAULT_WIDTH = DEFAULT_WIDTH;
  exports.DEFAULT_HEIGHT = DEFAULT_HEIGHT;
  exports.DIRS = DIRS;
  exports.KEYS = KEYS;
  return exports;
}({});

