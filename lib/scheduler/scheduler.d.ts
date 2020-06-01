import EventQueue from "../eventqueue.js";
export default class Scheduler<T = any> {
    _queue: EventQueue<T>;
    _repeat: T[];
    _current: any;
    /**
     * @class Abstract scheduler
     */
    constructor();
    /**
     * @see ROT.EventQueue#getTime
     */
    getTime(): number;
    /**
     * @param {?} item
     * @param {bool} repeat
     */
    add(item: T, repeat: boolean): this;
    /**
     * Get the time the given item is scheduled for
     * @param {?} item
     * @returns {number} time
     */
    getTimeOf(item: T): number | undefined;
    /**
     * Clear all items
     */
    clear(): this;
    /**
     * Remove a previously added item
     * @param {?} item
     * @returns {bool} successful?
     */
    remove(item: any): boolean;
    /**
     * Schedule next item
     * @returns {?}
     */
    next(): any;
}
