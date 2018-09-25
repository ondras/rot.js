import Map, { CreateCallback } from "./map";
/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
export default class Arena extends Map {
    create(callback: CreateCallback): this;
}
