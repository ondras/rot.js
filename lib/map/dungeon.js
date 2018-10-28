import Map from "./map.js";
export default class Dungeon extends Map {
    constructor(width, height) {
        super(width, height);
        this._rooms = [];
        this._corridors = [];
    }
    getRooms() { return this._rooms; }
    getCorridors() { return this._corridors; }
}
