import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../constants.js";

export interface CreateCallback { (x: number, y: number, contents: number): any };

export default abstract class Map {
	_width: number;
	_height: number;

	/**
	 * @class Base map generator
	 * @param {int} [width=ROT.DEFAULT_WIDTH]
	 * @param {int} [height=ROT.DEFAULT_HEIGHT]
	 */
	constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
		this._width = width;
		this._height = height;
	};

	abstract create(callback?: CreateCallback): void;

	_fillMap(value: number) {
		let map: number[][] = [];
		for (let i=0;i<this._width;i++) {
			map.push([]);
			for (let j=0;j<this._height;j++) { map[i].push(value); }
		}
		return map;
	}
}
