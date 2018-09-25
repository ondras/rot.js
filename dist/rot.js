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

  var FRAC = 2.3283064365386963e-10;

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
    }, {
      key: "getUniformInt",
      value: function getUniformInt(lowerBound, upperBound) {
        var max = Math.max(lowerBound, upperBound);
        var min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
      }
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
    }, {
      key: "getPercentage",
      value: function getPercentage() {
        return 1 + Math.floor(this.getUniform() * 100);
      }
    }, {
      key: "getItem",
      value: function getItem(array) {
        if (!array.length) {
          return null;
        }

        return array[Math.floor(this.getUniform() * array.length)];
      }
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
        }

        return id;
      }
    }, {
      key: "getState",
      value: function getState() {
        return [this._s0, this._s1, this._s2, this._c];
      }
    }, {
      key: "setState",
      value: function setState(state) {
        this._s0 = state[0];
        this._s1 = state[1];
        this._s2 = state[2];
        this._c = state[3];
        return this;
      }
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
        var oldFont = this._context.font;
        this._context.font = "100px " + this._options.fontFamily;
        var width = Math.ceil(this._context.measureText("W").width);
        this._context.font = oldFont;
        var ratio = width / 100;
        hexSize = Math.floor(hexSize) + 1;
        var fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
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
          x -= this._spacingX;
          x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
        } else {
          x = 2 * Math.floor(x / (2 * this._spacingX));
        }

        return [x, y];
      }
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

  var RE_COLORS = /%([bc]){([^}]*)}/g;
  var TYPE_TEXT = 0;
  var TYPE_NEWLINE = 1;
  var TYPE_FG = 2;
  var TYPE_BG = 3;

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

      var _index2 = token.value.indexOf("\n");

      if (_index2 != -1) {
        token.value = breakInsideToken(tokens, i, _index2, true);
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
          token.value = breakInsideToken(tokens, i, _index3, true);
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

    for (var _i2 = 0; _i2 < tokens.length; _i2++) {
      var _token2 = tokens[_i2];

      switch (_token2.type) {
        case TYPE_TEXT:
          lastTextToken = _token2;
          break;

        case TYPE_NEWLINE:
          if (lastTextToken) {
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
  var DEFAULT_WIDTH = 80;
  var DEFAULT_HEIGHT = 25;
  var DIRS = {
    4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
  };
  var KEYS = {
    VK_CANCEL: 3,
    VK_HELP: 6,
    VK_BACK_SPACE: 8,
    VK_TAB: 9,
    VK_CLEAR: 12,
    VK_RETURN: 13,
    VK_ENTER: 14,
    VK_SHIFT: 16,
    VK_CONTROL: 17,
    VK_ALT: 18,
    VK_PAUSE: 19,
    VK_CAPS_LOCK: 20,
    VK_ESCAPE: 27,
    VK_SPACE: 32,
    VK_PAGE_UP: 33,
    VK_PAGE_DOWN: 34,
    VK_END: 35,
    VK_HOME: 36,
    VK_LEFT: 37,
    VK_UP: 38,
    VK_RIGHT: 39,
    VK_DOWN: 40,
    VK_PRINTSCREEN: 44,
    VK_INSERT: 45,
    VK_DELETE: 46,
    VK_0: 48,
    VK_1: 49,
    VK_2: 50,
    VK_3: 51,
    VK_4: 52,
    VK_5: 53,
    VK_6: 54,
    VK_7: 55,
    VK_8: 56,
    VK_9: 57,
    VK_COLON: 58,
    VK_SEMICOLON: 59,
    VK_LESS_THAN: 60,
    VK_EQUALS: 61,
    VK_GREATER_THAN: 62,
    VK_QUESTION_MARK: 63,
    VK_AT: 64,
    VK_A: 65,
    VK_B: 66,
    VK_C: 67,
    VK_D: 68,
    VK_E: 69,
    VK_F: 70,
    VK_G: 71,
    VK_H: 72,
    VK_I: 73,
    VK_J: 74,
    VK_K: 75,
    VK_L: 76,
    VK_M: 77,
    VK_N: 78,
    VK_O: 79,
    VK_P: 80,
    VK_Q: 81,
    VK_R: 82,
    VK_S: 83,
    VK_T: 84,
    VK_U: 85,
    VK_V: 86,
    VK_W: 87,
    VK_X: 88,
    VK_Y: 89,
    VK_Z: 90,
    VK_CONTEXT_MENU: 93,
    VK_NUMPAD0: 96,
    VK_NUMPAD1: 97,
    VK_NUMPAD2: 98,
    VK_NUMPAD3: 99,
    VK_NUMPAD4: 100,
    VK_NUMPAD5: 101,
    VK_NUMPAD6: 102,
    VK_NUMPAD7: 103,
    VK_NUMPAD8: 104,
    VK_NUMPAD9: 105,
    VK_MULTIPLY: 106,
    VK_ADD: 107,
    VK_SEPARATOR: 108,
    VK_SUBTRACT: 109,
    VK_DECIMAL: 110,
    VK_DIVIDE: 111,
    VK_F1: 112,
    VK_F2: 113,
    VK_F3: 114,
    VK_F4: 115,
    VK_F5: 116,
    VK_F6: 117,
    VK_F7: 118,
    VK_F8: 119,
    VK_F9: 120,
    VK_F10: 121,
    VK_F11: 122,
    VK_F12: 123,
    VK_F13: 124,
    VK_F14: 125,
    VK_F15: 126,
    VK_F16: 127,
    VK_F17: 128,
    VK_F18: 129,
    VK_F19: 130,
    VK_F20: 131,
    VK_F21: 132,
    VK_F22: 133,
    VK_F23: 134,
    VK_F24: 135,
    VK_NUM_LOCK: 144,
    VK_SCROLL_LOCK: 145,
    VK_CIRCUMFLEX: 160,
    VK_EXCLAMATION: 161,
    VK_DOUBLE_QUOTE: 162,
    VK_HASH: 163,
    VK_DOLLAR: 164,
    VK_PERCENT: 165,
    VK_AMPERSAND: 166,
    VK_UNDERSCORE: 167,
    VK_OPEN_PAREN: 168,
    VK_CLOSE_PAREN: 169,
    VK_ASTERISK: 170,
    VK_PLUS: 171,
    VK_PIPE: 172,
    VK_HYPHEN_MINUS: 173,
    VK_OPEN_CURLY_BRACKET: 174,
    VK_CLOSE_CURLY_BRACKET: 175,
    VK_TILDE: 176,
    VK_COMMA: 188,
    VK_PERIOD: 190,
    VK_SLASH: 191,
    VK_BACK_QUOTE: 192,
    VK_OPEN_BRACKET: 219,
    VK_BACK_SLASH: 220,
    VK_CLOSE_BRACKET: 221,
    VK_QUOTE: 222,
    VK_META: 224,
    VK_ALTGR: 225,
    VK_WIN: 91,
    VK_KANA: 21,
    VK_HANGUL: 21,
    VK_EISU: 22,
    VK_JUNJA: 23,
    VK_FINAL: 24,
    VK_HANJA: 25,
    VK_KANJI: 25,
    VK_CONVERT: 28,
    VK_NONCONVERT: 29,
    VK_ACCEPT: 30,
    VK_MODECHANGE: 31,
    VK_SELECT: 41,
    VK_PRINT: 42,
    VK_EXECUTE: 43,
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

  var Display =
  /*#__PURE__*/
  function () {
    function Display() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Display);

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

    _createClass(Display, [{
      key: "DEBUG",
      value: function DEBUG(x, y, what) {
        var colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
      }
    }, {
      key: "clear",
      value: function clear() {
        this._data = {};
        this._dirty = true;
      }
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
    }, {
      key: "getOptions",
      value: function getOptions() {
        return this._options;
      }
    }, {
      key: "getContainer",
      value: function getContainer() {
        return this._context.canvas;
      }
    }, {
      key: "computeSize",
      value: function computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
      }
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

        if (!this._dirty) {
          this._dirty = {};
        }

        this._dirty[key] = true;
      }
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
      }
    }, {
      key: "_tick",
      value: function _tick() {
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
      }
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

    _createClass(StringGenerator, [{
      key: "clear",
      value: function clear() {
        this._data = {};
        this._priorValues = {};
      }
    }, {
      key: "generate",
      value: function generate() {
        var result = [this._sample(this._prefix)];

        while (result[result.length - 1] != this._boundary) {
          result.push(this._sample(result));
        }

        return this._join(result.slice(0, -1));
      }
    }, {
      key: "observe",
      value: function observe(string) {
        var tokens = this._split(string);

        for (var i = 0; i < tokens.length; i++) {
          this._priorValues[tokens[i]] = this._options.prior;
        }

        tokens = this._prefix.concat(tokens).concat(this._suffix);

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
        priorCount--;
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
    }, {
      key: "_split",
      value: function _split(str) {
        return str.split(this._options.words ? /\s+/ : "");
      }
    }, {
      key: "_join",
      value: function _join(arr) {
        return arr.join(this._options.words ? " " : "");
      }
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
    function EventQueue() {
      _classCallCheck(this, EventQueue);

      this._time = 0;
      this._events = [];
      this._eventTimes = [];
    }

    _createClass(EventQueue, [{
      key: "getTime",
      value: function getTime() {
        return this._time;
      }
    }, {
      key: "clear",
      value: function clear() {
        this._events = [];
        this._eventTimes = [];
        return this;
      }
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
    }, {
      key: "get",
      value: function get() {
        if (!this._events.length) {
          return null;
        }

        var time = this._eventTimes.splice(0, 1)[0];

        if (time > 0) {
          this._time += time;

          for (var i = 0; i < this._eventTimes.length; i++) {
            this._eventTimes[i] -= time;
          }
        }

        return this._events.splice(0, 1)[0];
      }
    }, {
      key: "getEventTime",
      value: function getEventTime(event) {
        var index = this._events.indexOf(event);

        if (index == -1) {
          return undefined;
        }

        return this._eventTimes[index];
      }
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
    function Scheduler() {
      _classCallCheck(this, Scheduler);

      this._queue = new EventQueue();
      this._repeat = [];
      this._current = null;
    }

    _createClass(Scheduler, [{
      key: "getTime",
      value: function getTime() {
        return this._queue.getTime();
      }
    }, {
      key: "add",
      value: function add(item, repeat) {
        if (repeat) {
          this._repeat.push(item);
        }

        return this;
      }
    }, {
      key: "getTimeOf",
      value: function getTimeOf(item) {
        return this._queue.getEventTime(item);
      }
    }, {
      key: "clear",
      value: function clear() {
        this._queue.clear();

        this._repeat = [];
        this._current = null;
        return this;
      }
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
    }, {
      key: "next",
      value: function next() {
        this._current = this._queue.get();
        return this._current;
      }
    }]);

    return Scheduler;
  }();

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
      value: function add(item, repeat, time) {
        this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());

        return _get(_getPrototypeOf(Speed.prototype), "add", this).call(this, item, repeat);
      }
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

  var Action =
  /*#__PURE__*/
  function (_Scheduler3) {
    _inherits(Action, _Scheduler3);

    function Action() {
      var _this4;

      _classCallCheck(this, Action);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Action).call(this));
      _this4._defaultDuration = 1;
      _this4._duration = _this4._defaultDuration;
      return _this4;
    }

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
    }, {
      key: "next",
      value: function next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
          this._queue.add(this._current, this._duration || this._defaultDuration);

          this._duration = this._defaultDuration;
        }

        return _get(_getPrototypeOf(Action.prototype), "next", this).call(this);
      }
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
    function FOV(lightPassesCallback) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, FOV);

      this._lightPasses = lightPassesCallback;
      this._options = Object.assign({
        topology: 8
      }, options);
    }

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

        var x = cx + startOffset[0] * r;
        var y = cy + startOffset[1] * r;

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
        callback(x, y, 0, 1);

        if (!this._lightPasses(x, y)) {
          return;
        }

        var DATA = [];
        var A, B, cx, cy, blocks;

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
          }
        }
      }
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
          if (blocks) {
            DATA.push(A, B);
          }

          return true;
        }

        var count = 0;

        if (index % 2) {
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
          while (index < DATA.length && DATA[index] < B) {
            index++;
            count++;
          }

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
        callback(x, y, 0, 1);

        if (!this._lightPasses(x, y)) {
          return;
        }

        var SHADOWS = [];
        var cx, cy, blocks, A1, A2, visibility;

        for (var r = 1; r <= R; r++) {
          var neighbors = this._getCircle(x, y, r);

          var neighborCount = neighbors.length;

          for (var i = 0; i < neighborCount; i++) {
            cx = neighbors[i][0];
            cy = neighbors[i][1];
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
          }
        }
      }
    }, {
      key: "_checkVisibility",
      value: function _checkVisibility(A1, A2, blocks, SHADOWS) {
        if (A1[0] > A2[0]) {
          var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);

          var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);

          return (v1 + v2) / 2;
        }

        var index1 = 0,
            edge1 = false;

        while (index1 < SHADOWS.length) {
          var old = SHADOWS[index1];
          var diff = old[0] * A1[1] - A1[0] * old[1];

          if (diff >= 0) {
            if (diff == 0 && !(index1 % 2)) {
              edge1 = true;
            }

            break;
          }

          index1++;
        }

        var index2 = SHADOWS.length,
            edge2 = false;

        while (index2--) {
          var _old = SHADOWS[index2];

          var _diff = A2[0] * _old[1] - _old[0] * A2[1];

          if (_diff >= 0) {
            if (_diff == 0 && index2 % 2) {
              edge2 = true;
            }

            break;
          }
        }

        var visible = true;

        if (index1 == index2 && (edge1 || edge2)) {
          visible = false;
        } else if (edge1 && edge2 && index1 + 1 == index2 && index2 % 2) {
          visible = false;
        } else if (index1 > index2 && index1 % 2) {
          visible = false;
        }

        if (!visible) {
          return 0;
        }

        var visibleLength;
        var remove = index2 - index1 + 1;

        if (remove % 2) {
          if (index1 % 2) {
            var P = SHADOWS[index1];
            visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);

            if (blocks) {
              SHADOWS.splice(index1, remove, A2);
            }
          } else {
            var _P = SHADOWS[index2];
            visibleLength = (_P[0] * A1[1] - A1[0] * _P[1]) / (A1[1] * _P[1]);

            if (blocks) {
              SHADOWS.splice(index1, remove, A1);
            }
          }
        } else {
          if (index1 % 2) {
            var P1 = SHADOWS[index1];
            var P2 = SHADOWS[index2];
            visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);

            if (blocks) {
              SHADOWS.splice(index1, remove);
            }
          } else {
            if (blocks) {
              SHADOWS.splice(index1, remove, A1, A2);
            }

            return 1;
          }
        }

        var arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
        return visibleLength / arcLength;
      }
    }]);

    return PreciseShadowcasting;
  }(FOV);

  var OCTANTS = [[-1, 0, 0, 1], [0, -1, 1, 0], [0, -1, -1, 0], [-1, 0, 0, -1], [1, 0, 0, -1], [0, 1, -1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];

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
      value: function compute(x, y, R, callback) {
        callback(x, y, 0, 1);

        for (var i = 0; i < OCTANTS.length; i++) {
          this._renderOctant(x, y, OCTANTS[i], R, callback);
        }
      }
    }, {
      key: "compute180",
      value: function compute180(x, y, R, dir, callback) {
        callback(x, y, 0, 1);
        var previousOctant = (dir - 1 + 8) % 8;
        var nextPreviousOctant = (dir - 2 + 8) % 8;
        var nextOctant = (dir + 1 + 8) % 8;

        this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);

        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);

        this._renderOctant(x, y, OCTANTS[dir], R, callback);

        this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
      }
    }, {
      key: "compute90",
      value: function compute90(x, y, R, dir, callback) {
        callback(x, y, 0, 1);
        var previousOctant = (dir - 1 + 8) % 8;

        this._renderOctant(x, y, OCTANTS[dir], R, callback);

        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
      }
    }, {
      key: "_renderOctant",
      value: function _renderOctant(x, y, octant, R, callback) {
        this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
      }
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
          var newStart = 0;

          while (dx <= 0) {
            dx += 1;
            var mapX = startX + dx * xx + dy * xy;
            var mapY = startY + dx * yx + dy * yy;
            var slopeStart = (dx - 0.5) / (dy + 0.5);
            var slopeEnd = (dx + 0.5) / (dy - 0.5);

            if (slopeEnd > visSlopeStart) {
              continue;
            }

            if (slopeStart < visSlopeEnd) {
              break;
            }

            if (dx * dx + dy * dy < radius * radius) {
              callback(mapX, mapY, i, 1);
            }

            if (!blocked) {
              if (!this._lightPasses(mapX, mapY) && i < radius) {
                blocked = true;

                this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);

                newStart = slopeEnd;
              }
            } else {
              if (!this._lightPasses(mapX, mapY)) {
                newStart = slopeEnd;
                continue;
              }

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

  var Dungeon =
  /*#__PURE__*/
  function (_Map2) {
    _inherits(Dungeon, _Map2);

    function Dungeon(width, height) {
      var _this5;

      _classCallCheck(this, Dungeon);

      _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Dungeon).call(this, width, height));
      _this5._rooms = [];
      _this5._corridors = [];
      return _this5;
    }

    _createClass(Dungeon, [{
      key: "getRooms",
      value: function getRooms() {
        return this._rooms;
      }
    }, {
      key: "getCorridors",
      value: function getCorridors() {
        return this._corridors;
      }
    }]);

    return Dungeon;
  }(Map);

  var Feature = function Feature() {
    _classCallCheck(this, Feature);
  };

  var Room =
  /*#__PURE__*/
  function (_Feature) {
    _inherits(Room, _Feature);

    function Room(x1, y1, x2, y2, doorX, doorY) {
      var _this6;

      _classCallCheck(this, Room);

      _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Room).call(this));
      _this6._x1 = x1;
      _this6._y1 = y1;
      _this6._x2 = x2;
      _this6._y2 = y2;
      _this6._doors = {};

      if (doorX !== undefined && doorY !== undefined) {
        _this6.addDoor(doorX, doorY);
      }

      return _this6;
    }

    _createClass(Room, [{
      key: "addDoor",
      value: function addDoor(x, y) {
        this._doors[x + "," + y] = 1;
        return this;
      }
    }, {
      key: "getDoors",
      value: function getDoors(cb) {
        for (var key in this._doors) {
          var parts = key.split(",");
          cb(parseInt(parts[0]), parseInt(parts[1]));
        }

        return this;
      }
    }, {
      key: "clearDoors",
      value: function clearDoors() {
        this._doors = {};
        return this;
      }
    }, {
      key: "addDoors",
      value: function addDoors(isWallCallback) {
        var left = this._x1 - 1;
        var right = this._x2 + 1;
        var top = this._y1 - 1;
        var bottom = this._y2 + 1;

        for (var x = left; x <= right; x++) {
          for (var y = top; y <= bottom; y++) {
            if (x != left && x != right && y != top && y != bottom) {
              continue;
            }

            if (isWallCallback(x, y)) {
              continue;
            }

            this.addDoor(x, y);
          }
        }

        return this;
      }
    }, {
      key: "debug",
      value: function debug() {
        console.log("room", this._x1, this._y1, this._x2, this._y2);
      }
    }, {
      key: "isValid",
      value: function isValid(isWallCallback, canBeDugCallback) {
        var left = this._x1 - 1;
        var right = this._x2 + 1;
        var top = this._y1 - 1;
        var bottom = this._y2 + 1;

        for (var x = left; x <= right; x++) {
          for (var y = top; y <= bottom; y++) {
            if (x == left || x == right || y == top || y == bottom) {
              if (!isWallCallback(x, y)) {
                return false;
              }
            } else {
              if (!canBeDugCallback(x, y)) {
                return false;
              }
            }
          }
        }

        return true;
      }
    }, {
      key: "create",
      value: function create(digCallback) {
        var left = this._x1 - 1;
        var right = this._x2 + 1;
        var top = this._y1 - 1;
        var bottom = this._y2 + 1;
        var value = 0;

        for (var x = left; x <= right; x++) {
          for (var y = top; y <= bottom; y++) {
            if (x + "," + y in this._doors) {
              value = 2;
            } else if (x == left || x == right || y == top || y == bottom) {
              value = 1;
            } else {
              value = 0;
            }

            digCallback(x, y, value);
          }
        }
      }
    }, {
      key: "getCenter",
      value: function getCenter() {
        return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
      }
    }, {
      key: "getLeft",
      value: function getLeft() {
        return this._x1;
      }
    }, {
      key: "getRight",
      value: function getRight() {
        return this._x2;
      }
    }, {
      key: "getTop",
      value: function getTop() {
        return this._y1;
      }
    }, {
      key: "getBottom",
      value: function getBottom() {
        return this._y2;
      }
    }], [{
      key: "createRandomAt",
      value: function createRandomAt(x, y, dx, dy, options) {
        var min = options.roomWidth[0];
        var max = options.roomWidth[1];
        var width = RNG$1.getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        var height = RNG$1.getUniformInt(min, max);

        if (dx == 1) {
          var y2 = y - Math.floor(RNG$1.getUniform() * height);
          return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
        }

        if (dx == -1) {
          var _y = y - Math.floor(RNG$1.getUniform() * height);

          return new this(x - width, _y, x - 1, _y + height - 1, x, y);
        }

        if (dy == 1) {
          var x2 = x - Math.floor(RNG$1.getUniform() * width);
          return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
        }

        if (dy == -1) {
          var _x = x - Math.floor(RNG$1.getUniform() * width);

          return new this(_x, y - height, _x + width - 1, y - 1, x, y);
        }

        throw new Error("dx or dy must be 1 or -1");
      }
    }, {
      key: "createRandomCenter",
      value: function createRandomCenter(cx, cy, options) {
        var min = options.roomWidth[0];
        var max = options.roomWidth[1];
        var width = RNG$1.getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        var height = RNG$1.getUniformInt(min, max);
        var x1 = cx - Math.floor(RNG$1.getUniform() * width);
        var y1 = cy - Math.floor(RNG$1.getUniform() * height);
        var x2 = x1 + width - 1;
        var y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
      }
    }, {
      key: "createRandom",
      value: function createRandom(availWidth, availHeight, options) {
        var min = options.roomWidth[0];
        var max = options.roomWidth[1];
        var width = RNG$1.getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        var height = RNG$1.getUniformInt(min, max);
        var left = availWidth - width - 1;
        var top = availHeight - height - 1;
        var x1 = 1 + Math.floor(RNG$1.getUniform() * left);
        var y1 = 1 + Math.floor(RNG$1.getUniform() * top);
        var x2 = x1 + width - 1;
        var y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
      }
    }]);

    return Room;
  }(Feature);

  var Corridor =
  /*#__PURE__*/
  function (_Feature2) {
    _inherits(Corridor, _Feature2);

    function Corridor(startX, startY, endX, endY) {
      var _this7;

      _classCallCheck(this, Corridor);

      _this7 = _possibleConstructorReturn(this, _getPrototypeOf(Corridor).call(this));
      _this7._startX = startX;
      _this7._startY = startY;
      _this7._endX = endX;
      _this7._endY = endY;
      _this7._endsWithAWall = true;
      return _this7;
    }

    _createClass(Corridor, [{
      key: "debug",
      value: function debug() {
        console.log("corridor", this._startX, this._startY, this._endX, this._endY);
      }
    }, {
      key: "isValid",
      value: function isValid(isWallCallback, canBeDugCallback) {
        var sx = this._startX;
        var sy = this._startY;
        var dx = this._endX - sx;
        var dy = this._endY - sy;
        var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

        if (dx) {
          dx = dx / Math.abs(dx);
        }

        if (dy) {
          dy = dy / Math.abs(dy);
        }

        var nx = dy;
        var ny = -dx;
        var ok = true;

        for (var i = 0; i < length; i++) {
          var x = sx + i * dx;
          var y = sy + i * dy;

          if (!canBeDugCallback(x, y)) {
            ok = false;
          }

          if (!isWallCallback(x + nx, y + ny)) {
            ok = false;
          }

          if (!isWallCallback(x - nx, y - ny)) {
            ok = false;
          }

          if (!ok) {
            length = i;
            this._endX = x - dx;
            this._endY = y - dy;
            break;
          }
        }

        if (length == 0) {
          return false;
        }

        if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
          return false;
        }

        var firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
        var secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
        this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);

        if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
          return false;
        }

        return true;
      }
    }, {
      key: "create",
      value: function create(digCallback) {
        var sx = this._startX;
        var sy = this._startY;
        var dx = this._endX - sx;
        var dy = this._endY - sy;
        var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

        if (dx) {
          dx = dx / Math.abs(dx);
        }

        if (dy) {
          dy = dy / Math.abs(dy);
        }

        for (var i = 0; i < length; i++) {
          var x = sx + i * dx;
          var y = sy + i * dy;
          digCallback(x, y, 0);
        }

        return true;
      }
    }, {
      key: "createPriorityWalls",
      value: function createPriorityWalls(priorityWallCallback) {
        if (!this._endsWithAWall) {
          return;
        }

        var sx = this._startX;
        var sy = this._startY;
        var dx = this._endX - sx;
        var dy = this._endY - sy;

        if (dx) {
          dx = dx / Math.abs(dx);
        }

        if (dy) {
          dy = dy / Math.abs(dy);
        }

        var nx = dy;
        var ny = -dx;
        priorityWallCallback(this._endX + dx, this._endY + dy);
        priorityWallCallback(this._endX + nx, this._endY + ny);
        priorityWallCallback(this._endX - nx, this._endY - ny);
      }
    }], [{
      key: "createRandomAt",
      value: function createRandomAt(x, y, dx, dy, options) {
        var min = options.corridorLength[0];
        var max = options.corridorLength[1];
        var length = RNG$1.getUniformInt(min, max);
        return new this(x, y, x + dx * length, y + dy * length);
      }
    }]);

    return Corridor;
  }(Feature);

  var Uniform =
  /*#__PURE__*/
  function (_Dungeon) {
    _inherits(Uniform, _Dungeon);

    function Uniform(width, height, options) {
      var _this8;

      _classCallCheck(this, Uniform);

      _this8 = _possibleConstructorReturn(this, _getPrototypeOf(Uniform).call(this, width, height));
      _this8._options = {
        roomWidth: [3, 9],
        roomHeight: [3, 5],
        roomDugPercentage: 0.1,
        timeLimit: 1000
      };
      Object.assign(_this8._options, options);
      _this8._map = [];
      _this8._dug = 0;
      _this8._roomAttempts = 20;
      _this8._corridorAttempts = 20;
      _this8._connected = [];
      _this8._unconnected = [];
      _this8._digCallback = _this8._digCallback.bind(_assertThisInitialized(_assertThisInitialized(_this8)));
      _this8._canBeDugCallback = _this8._canBeDugCallback.bind(_assertThisInitialized(_assertThisInitialized(_this8)));
      _this8._isWallCallback = _this8._isWallCallback.bind(_assertThisInitialized(_assertThisInitialized(_this8)));
      return _this8;
    }

    _createClass(Uniform, [{
      key: "create",
      value: function create(callback) {
        var t1 = Date.now();

        while (1) {
          var t2 = Date.now();

          if (t2 - t1 > this._options.timeLimit) {
            return null;
          }

          this._map = this._fillMap(1);
          this._dug = 0;
          this._rooms = [];
          this._unconnected = [];

          this._generateRooms();

          if (this._rooms.length < 2) {
            continue;
          }

          if (this._generateCorridors()) {
            break;
          }
        }

        if (callback) {
          for (var i = 0; i < this._width; i++) {
            for (var j = 0; j < this._height; j++) {
              callback(i, j, this._map[i][j]);
            }
          }
        }

        return this;
      }
    }, {
      key: "_generateRooms",
      value: function _generateRooms() {
        var w = this._width - 2;
        var h = this._height - 2;

        do {
          var room = this._generateRoom();

          if (this._dug / (w * h) > this._options.roomDugPercentage) {
            break;
          }
        } while (room);
      }
    }, {
      key: "_generateRoom",
      value: function _generateRoom() {
        var count = 0;

        while (count < this._roomAttempts) {
          count++;
          var room = Room.createRandom(this._width, this._height, this._options);

          if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
            continue;
          }

          room.create(this._digCallback);

          this._rooms.push(room);

          return room;
        }

        return null;
      }
    }, {
      key: "_generateCorridors",
      value: function _generateCorridors() {
        var cnt = 0;

        while (cnt < this._corridorAttempts) {
          cnt++;
          this._corridors = [];
          this._map = this._fillMap(1);

          for (var i = 0; i < this._rooms.length; i++) {
            var room = this._rooms[i];
            room.clearDoors();
            room.create(this._digCallback);
          }

          this._unconnected = RNG$1.shuffle(this._rooms.slice());
          this._connected = [];

          if (this._unconnected.length) {
            this._connected.push(this._unconnected.pop());
          }

          while (1) {
            var connected = RNG$1.getItem(this._connected);

            if (!connected) {
              break;
            }

            var room1 = this._closestRoom(this._unconnected, connected);

            if (!room1) {
              break;
            }

            var room2 = this._closestRoom(this._connected, room1);

            if (!room2) {
              break;
            }

            var ok = this._connectRooms(room1, room2);

            if (!ok) {
              break;
            }

            if (!this._unconnected.length) {
              return true;
            }
          }
        }

        return false;
      }
    }, {
      key: "_closestRoom",
      value: function _closestRoom(rooms, room) {
        var dist = Infinity;
        var center = room.getCenter();
        var result = null;

        for (var i = 0; i < rooms.length; i++) {
          var r = rooms[i];
          var c = r.getCenter();
          var dx = c[0] - center[0];
          var dy = c[1] - center[1];
          var d = dx * dx + dy * dy;

          if (d < dist) {
            dist = d;
            result = r;
          }
        }

        return result;
      }
    }, {
      key: "_connectRooms",
      value: function _connectRooms(room1, room2) {
        var center1 = room1.getCenter();
        var center2 = room2.getCenter();
        var diffX = center2[0] - center1[0];
        var diffY = center2[1] - center1[1];
        var start;
        var end;
        var dirIndex1, dirIndex2, min, max, index;

        if (Math.abs(diffX) < Math.abs(diffY)) {
          dirIndex1 = diffY > 0 ? 2 : 0;
          dirIndex2 = (dirIndex1 + 2) % 4;
          min = room2.getLeft();
          max = room2.getRight();
          index = 0;
        } else {
          dirIndex1 = diffX > 0 ? 1 : 3;
          dirIndex2 = (dirIndex1 + 2) % 4;
          min = room2.getTop();
          max = room2.getBottom();
          index = 1;
        }

        start = this._placeInWall(room1, dirIndex1);

        if (!start) {
          return false;
        }

        if (start[index] >= min && start[index] <= max) {
          end = start.slice();
          var value = 0;

          switch (dirIndex2) {
            case 0:
              value = room2.getTop() - 1;
              break;

            case 1:
              value = room2.getRight() + 1;
              break;

            case 2:
              value = room2.getBottom() + 1;
              break;

            case 3:
              value = room2.getLeft() - 1;
              break;
          }

          end[(index + 1) % 2] = value;

          this._digLine([start, end]);
        } else if (start[index] < min - 1 || start[index] > max + 1) {
          var diff = start[index] - center2[index];
          var rotation = 0;

          switch (dirIndex2) {
            case 0:
            case 1:
              rotation = diff < 0 ? 3 : 1;
              break;

            case 2:
            case 3:
              rotation = diff < 0 ? 1 : 3;
              break;
          }

          dirIndex2 = (dirIndex2 + rotation) % 4;
          end = this._placeInWall(room2, dirIndex2);

          if (!end) {
            return false;
          }

          var mid = [0, 0];
          mid[index] = start[index];
          var index2 = (index + 1) % 2;
          mid[index2] = end[index2];

          this._digLine([start, mid, end]);
        } else {
          var _index4 = (index + 1) % 2;

          end = this._placeInWall(room2, dirIndex2);

          if (!end) {
            return false;
          }

          var _mid = Math.round((end[_index4] + start[_index4]) / 2);

          var mid1 = [0, 0];
          var mid2 = [0, 0];
          mid1[index] = start[index];
          mid1[_index4] = _mid;
          mid2[index] = end[index];
          mid2[_index4] = _mid;

          this._digLine([start, mid1, mid2, end]);
        }

        room1.addDoor(start[0], start[1]);
        room2.addDoor(end[0], end[1]);
        index = this._unconnected.indexOf(room1);

        if (index != -1) {
          this._unconnected.splice(index, 1);

          this._connected.push(room1);
        }

        index = this._unconnected.indexOf(room2);

        if (index != -1) {
          this._unconnected.splice(index, 1);

          this._connected.push(room2);
        }

        return true;
      }
    }, {
      key: "_placeInWall",
      value: function _placeInWall(room, dirIndex) {
        var start = [0, 0];
        var dir = [0, 0];
        var length = 0;

        switch (dirIndex) {
          case 0:
            dir = [1, 0];
            start = [room.getLeft(), room.getTop() - 1];
            length = room.getRight() - room.getLeft() + 1;
            break;

          case 1:
            dir = [0, 1];
            start = [room.getRight() + 1, room.getTop()];
            length = room.getBottom() - room.getTop() + 1;
            break;

          case 2:
            dir = [1, 0];
            start = [room.getLeft(), room.getBottom() + 1];
            length = room.getRight() - room.getLeft() + 1;
            break;

          case 3:
            dir = [0, 1];
            start = [room.getLeft() - 1, room.getTop()];
            length = room.getBottom() - room.getTop() + 1;
            break;
        }

        var avail = [];
        var lastBadIndex = -2;

        for (var i = 0; i < length; i++) {
          var x = start[0] + i * dir[0];
          var y = start[1] + i * dir[1];
          avail.push(null);
          var isWall = this._map[x][y] == 1;

          if (isWall) {
            if (lastBadIndex != i - 1) {
              avail[i] = [x, y];
            }
          } else {
            lastBadIndex = i;

            if (i) {
              avail[i - 1] = null;
            }
          }
        }

        for (var _i4 = avail.length - 1; _i4 >= 0; _i4--) {
          if (!avail[_i4]) {
            avail.splice(_i4, 1);
          }
        }

        return avail.length ? RNG$1.getItem(avail) : null;
      }
    }, {
      key: "_digLine",
      value: function _digLine(points) {
        for (var i = 1; i < points.length; i++) {
          var start = points[i - 1];
          var end = points[i];
          var corridor = new Corridor(start[0], start[1], end[0], end[1]);
          corridor.create(this._digCallback);

          this._corridors.push(corridor);
        }
      }
    }, {
      key: "_digCallback",
      value: function _digCallback(x, y, value) {
        this._map[x][y] = value;

        if (value == 0) {
          this._dug++;
        }
      }
    }, {
      key: "_isWallCallback",
      value: function _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
          return false;
        }

        return this._map[x][y] == 1;
      }
    }, {
      key: "_canBeDugCallback",
      value: function _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
          return false;
        }

        return this._map[x][y] == 1;
      }
    }]);

    return Uniform;
  }(Dungeon);

  var Cellular =
  /*#__PURE__*/
  function (_Map3) {
    _inherits(Cellular, _Map3);

    function Cellular(width, height) {
      var _this9;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Cellular);

      _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Cellular).call(this, width, height));
      _this9._options = {
        born: [5, 6, 7, 8],
        survive: [4, 5, 6, 7, 8],
        topology: 8
      };

      _this9.setOptions(options);

      _this9._dirs = DIRS[_this9._options.topology];
      _this9._map = _this9._fillMap(0);
      return _this9;
    }

    _createClass(Cellular, [{
      key: "randomize",
      value: function randomize(probability) {
        for (var i = 0; i < this._width; i++) {
          for (var j = 0; j < this._height; j++) {
            this._map[i][j] = RNG$1.getUniform() < probability ? 1 : 0;
          }
        }

        return this;
      }
    }, {
      key: "setOptions",
      value: function setOptions(options) {
        Object.assign(this._options, options);
      }
    }, {
      key: "set",
      value: function set(x, y, value) {
        this._map[x][y] = value;
      }
    }, {
      key: "create",
      value: function create(callback) {
        var newMap = this._fillMap(0);

        var born = this._options.born;
        var survive = this._options.survive;

        for (var j = 0; j < this._height; j++) {
          var widthStep = 1;
          var widthStart = 0;

          if (this._options.topology == 6) {
            widthStep = 2;
            widthStart = j % 2;
          }

          for (var i = widthStart; i < this._width; i += widthStep) {
            var cur = this._map[i][j];

            var ncount = this._getNeighbors(i, j);

            if (cur && survive.indexOf(ncount) != -1) {
              newMap[i][j] = 1;
            } else if (!cur && born.indexOf(ncount) != -1) {
              newMap[i][j] = 1;
            }
          }
        }

        this._map = newMap;
        callback && this._serviceCallback(callback);
      }
    }, {
      key: "_serviceCallback",
      value: function _serviceCallback(callback) {
        for (var j = 0; j < this._height; j++) {
          var widthStep = 1;
          var widthStart = 0;

          if (this._options.topology == 6) {
            widthStep = 2;
            widthStart = j % 2;
          }

          for (var i = widthStart; i < this._width; i += widthStep) {
            callback(i, j, this._map[i][j]);
          }
        }
      }
    }, {
      key: "_getNeighbors",
      value: function _getNeighbors(cx, cy) {
        var result = 0;

        for (var i = 0; i < this._dirs.length; i++) {
          var dir = this._dirs[i];
          var x = cx + dir[0];
          var y = cy + dir[1];

          if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            continue;
          }

          result += this._map[x][y] == 1 ? 1 : 0;
        }

        return result;
      }
    }, {
      key: "connect",
      value: function connect(callback, value, connectionCallback) {
        if (!value) value = 0;
        var allFreeSpace = [];
        var notConnected = {};
        var widthStep = 1;
        var widthStarts = [0, 0];

        if (this._options.topology == 6) {
          widthStep = 2;
          widthStarts = [0, 1];
        }

        for (var y = 0; y < this._height; y++) {
          for (var x = widthStarts[y % 2]; x < this._width; x += widthStep) {
            if (this._freeSpace(x, y, value)) {
              var p = [x, y];
              notConnected[this._pointKey(p)] = p;
              allFreeSpace.push([x, y]);
            }
          }
        }

        var start = allFreeSpace[RNG$1.getUniformInt(0, allFreeSpace.length - 1)];

        var key = this._pointKey(start);

        var connected = {};
        connected[key] = start;
        delete notConnected[key];

        this._findConnected(connected, notConnected, [start], false, value);

        while (Object.keys(notConnected).length > 0) {
          var _p = this._getFromTo(connected, notConnected);

          var from = _p[0];
          var to = _p[1];
          var local = {};
          local[this._pointKey(from)] = from;

          this._findConnected(local, notConnected, [from], true, value);

          var tunnelFn = this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected;
          tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);

          for (var k in local) {
            var pp = local[k];
            this._map[pp[0]][pp[1]] = value;
            connected[k] = pp;
            delete notConnected[k];
          }
        }

        callback && this._serviceCallback(callback);
      }
    }, {
      key: "_getFromTo",
      value: function _getFromTo(connected, notConnected) {
        var from = [0, 0],
            to = [0, 0],
            d;
        var connectedKeys = Object.keys(connected);
        var notConnectedKeys = Object.keys(notConnected);

        for (var i = 0; i < 5; i++) {
          if (connectedKeys.length < notConnectedKeys.length) {
            var keys = connectedKeys;
            to = connected[keys[RNG$1.getUniformInt(0, keys.length - 1)]];
            from = this._getClosest(to, notConnected);
          } else {
            var _keys = notConnectedKeys;
            from = notConnected[_keys[RNG$1.getUniformInt(0, _keys.length - 1)]];
            to = this._getClosest(from, connected);
          }

          d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);

          if (d < 64) {
            break;
          }
        }

        return [from, to];
      }
    }, {
      key: "_getClosest",
      value: function _getClosest(point, space) {
        var minPoint = null;
        var minDist = null;

        for (var k in space) {
          var p = space[k];
          var d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);

          if (minDist == null || d < minDist) {
            minDist = d;
            minPoint = p;
          }
        }

        return minPoint;
      }
    }, {
      key: "_findConnected",
      value: function _findConnected(connected, notConnected, stack, keepNotConnected, value) {
        while (stack.length > 0) {
          var p = stack.splice(0, 1)[0];
          var tests = void 0;

          if (this._options.topology == 6) {
            tests = [[p[0] + 2, p[1]], [p[0] + 1, p[1] - 1], [p[0] - 1, p[1] - 1], [p[0] - 2, p[1]], [p[0] - 1, p[1] + 1], [p[0] + 1, p[1] + 1]];
          } else {
            tests = [[p[0] + 1, p[1]], [p[0] - 1, p[1]], [p[0], p[1] + 1], [p[0], p[1] - 1]];
          }

          for (var i = 0; i < tests.length; i++) {
            var key = this._pointKey(tests[i]);

            if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
              connected[key] = tests[i];

              if (!keepNotConnected) {
                delete notConnected[key];
              }

              stack.push(tests[i]);
            }
          }
        }
      }
    }, {
      key: "_tunnelToConnected",
      value: function _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
        var a, b;

        if (from[0] < to[0]) {
          a = from;
          b = to;
        } else {
          a = to;
          b = from;
        }

        for (var xx = a[0]; xx <= b[0]; xx++) {
          this._map[xx][a[1]] = value;
          var p = [xx, a[1]];

          var pkey = this._pointKey(p);

          connected[pkey] = p;
          delete notConnected[pkey];
        }

        if (connectionCallback && a[0] < b[0]) {
          connectionCallback(a, [b[0], a[1]]);
        }

        var x = b[0];

        if (from[1] < to[1]) {
          a = from;
          b = to;
        } else {
          a = to;
          b = from;
        }

        for (var yy = a[1]; yy < b[1]; yy++) {
          this._map[x][yy] = value;
          var _p2 = [x, yy];

          var _pkey = this._pointKey(_p2);

          connected[_pkey] = _p2;
          delete notConnected[_pkey];
        }

        if (connectionCallback && a[1] < b[1]) {
          connectionCallback([b[0], a[1]], [b[0], b[1]]);
        }
      }
    }, {
      key: "_tunnelToConnected6",
      value: function _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
        var a, b;

        if (from[0] < to[0]) {
          a = from;
          b = to;
        } else {
          a = to;
          b = from;
        }

        var xx = a[0];
        var yy = a[1];

        while (!(xx == b[0] && yy == b[1])) {
          var stepWidth = 2;

          if (yy < b[1]) {
            yy++;
            stepWidth = 1;
          } else if (yy > b[1]) {
            yy--;
            stepWidth = 1;
          }

          if (xx < b[0]) {
            xx += stepWidth;
          } else if (xx > b[0]) {
            xx -= stepWidth;
          } else if (b[1] % 2) {
            xx -= stepWidth;
          } else {
            xx += stepWidth;
          }

          this._map[xx][yy] = value;
          var p = [xx, yy];

          var pkey = this._pointKey(p);

          connected[pkey] = p;
          delete notConnected[pkey];
        }

        if (connectionCallback) {
          connectionCallback(from, to);
        }
      }
    }, {
      key: "_freeSpace",
      value: function _freeSpace(x, y, value) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
      }
    }, {
      key: "_pointKey",
      value: function _pointKey(p) {
        return p[0] + "." + p[1];
      }
    }]);

    return Cellular;
  }(Map);

  var index$2 = {
    Arena: Arena,
    Uniform: Uniform,
    Cellular: Cellular
  };

  var Engine =
  /*#__PURE__*/
  function () {
    function Engine(scheduler) {
      _classCallCheck(this, Engine);

      this._scheduler = scheduler;
      this._lock = 1;
    }

    _createClass(Engine, [{
      key: "start",
      value: function start() {
        return this.unlock();
      }
    }, {
      key: "lock",
      value: function lock() {
        this._lock++;
        return this;
      }
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

          var result = actor.act();

          if (result && result.then) {
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
        cached = r[1].split(/\s*,\s*/).map(function (x) {
          return parseInt(x);
        });
      } else {
        cached = [0, 0, 0];
      }

      CACHE[str] = cached;
    }

    return cached.slice();
  }

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

  function interpolate(color1, color2) {
    var factor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var result = color1.slice();

    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }

    return result;
  }

  var lerp = interpolate;

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
      s = 0;
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
    function Lighting(reflectivityCallback) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Lighting);

      this._reflectivityCallback = reflectivityCallback;
      this._options = {};
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

    _createClass(Lighting, [{
      key: "setOptions",
      value: function setOptions(options) {
        Object.assign(this._options, options);

        if (options && options.range) {
          this.reset();
        }

        return this;
      }
    }, {
      key: "setFOV",
      value: function setFOV(fov) {
        this._fov = fov;
        this._fovCache = {};
        return this;
      }
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
    }, {
      key: "clearLights",
      value: function clearLights() {
        this._lights = {};
      }
    }, {
      key: "reset",
      value: function reset() {
        this._reflectivityCache = {};
        this._fovCache = {};
        return this;
      }
    }, {
      key: "compute",
      value: function compute(lightingCallback) {
        var doneCells = {};
        var emittingCells = {};
        var litCells = {};

        for (var key in this._lights) {
          var light = this._lights[key];
          emittingCells[key] = [0, 0, 0];
          add_(emittingCells[key], light);
        }

        for (var i = 0; i < this._options.passes; i++) {
          this._emitLight(emittingCells, litCells, doneCells);

          if (i + 1 == this._options.passes) {
            continue;
          }

          emittingCells = this._computeEmitters(litCells, doneCells);
        }

        for (var litKey in litCells) {
          var parts = litKey.split(",");
          var x = parseInt(parts[0]);
          var y = parseInt(parts[1]);
          lightingCallback(x, y, litCells[litKey]);
        }

        return this;
      }
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
    }, {
      key: "_computeEmitters",
      value: function _computeEmitters(litCells, doneCells) {
        var result = {};

        for (var key in litCells) {
          if (key in doneCells) {
            continue;
          }

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
            result = litCells[fovKey];
          } else {
            result = [0, 0, 0];
            litCells[fovKey] = result;
          }

          for (var i = 0; i < 3; i++) {
            result[i] += Math.round(color[i] * formFactor);
          }
        }

        return this;
      }
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

