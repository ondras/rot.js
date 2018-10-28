import EventQueue from "../eventqueue.js";
export default class Scheduler<T = any> {
    _queue: EventQueue<T>;
    _repeat: T[];
    _current: any;
    constructor();
    getTime(): number;
    add(item: T, repeat: boolean): this;
    getTimeOf(item: T): number | undefined;
    clear(): this;
    remove(item: any): boolean;
    next(): any;
}
