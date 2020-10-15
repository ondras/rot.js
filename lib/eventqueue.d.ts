import { MinHeap } from "./MinHeap.js";
export default class EventQueue<T = any> {
    _time: number;
    _events: MinHeap<T>;
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    constructor();
    /**
     * @returns {number} Elapsed time
     */
    getTime(): number;
    /**
     * Clear all scheduled events
     */
    clear(): this;
    /**
     * @param {?} event
     * @param {number} time
     */
    add(event: T, time: number): void;
    /**
     * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
     * @returns {? || null} The event previously added by addEvent, null if no event available
     */
    get(): T | null;
    /**
     * Get the time associated with the given event
     * @param {?} event
     * @returns {number} time
     */
    getEventTime(event: T): number | undefined;
    /**
     * Remove an event from the queue
     * @param {?} event
     * @returns {bool} success?
     */
    remove(event: T): boolean;
}
