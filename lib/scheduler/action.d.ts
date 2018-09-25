import Scheduler from "./scheduler.js";
export default class Action<T = any> extends Scheduler<T> {
    _defaultDuration: number;
    _duration: number;
    constructor();
    add(item: T, repeat: boolean, time?: number): this;
    clear(): this;
    remove(item: T): boolean;
    next(): any;
    setDuration(time: number): this;
}
