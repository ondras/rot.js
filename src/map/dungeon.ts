import Map from "./map.js";
import { Room, Corridor } from "./features.js";

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
export default abstract class Dungeon extends Map {
	_rooms: Room[];
	_corridors: Corridor[];

	constructor(width: number, height: number) {
		super(width, height);
		this._rooms = [];
		this._corridors = [];
	}

	/**
	 * Get all generated rooms
	 * @returns {ROT.Map.Feature.Room[]}
	 */
	getRooms() { return this._rooms; }

	/**
	 * Get all generated corridors
	 * @returns {ROT.Map.Feature.Corridor[]}
	 */
	getCorridors() { return this._corridors; }
}
