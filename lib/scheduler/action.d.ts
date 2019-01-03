import Scheduler from "./scheduler.js";
/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
export default class Action<T = any> extends Scheduler<T> {
    _defaultDuration: number;
    _duration: number;
    constructor();
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */
    add(item: T, repeat: boolean, time?: number): this;
    clear(): this;
    remove(item: T): boolean;
    /**
     * @see ROT.Scheduler#next
     */
    next(): any;
    /**
     * Set duration for the active item
     */
    setDuration(time: number): this;
}
