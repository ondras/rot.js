import Map from "./map.js";
import { Room, Corridor } from "./features.js";
export default abstract class Dungeon extends Map {
    _rooms: Room[];
    _corridors: Corridor[];
    constructor(width: number, height: number);
    getRooms(): Room[];
    getCorridors(): Corridor[];
}
