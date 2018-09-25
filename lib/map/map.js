import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../constants.js";
;
export default class Map {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
        this._width = width;
        this._height = height;
    }
    ;
    _fillMap(value) {
        let map = [];
        for (let i = 0; i < this._width; i++) {
            map.push([]);
            for (let j = 0; j < this._height; j++) {
                map[i].push(value);
            }
        }
        return map;
    }
}
