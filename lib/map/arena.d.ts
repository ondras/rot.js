import Map, { CreateCallback } from "./map.js";
/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
export default class Arena extends Map {
    create(callback: CreateCallback): this;
}
