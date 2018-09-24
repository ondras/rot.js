import Scheduler from "./scheduler.js";
/**
 * @class Simple fair scheduler (round-robin style)
 */
export default class Simple<T = any> extends Scheduler<T> {
    add(item: any, repeat: boolean): this;
    next(): any;
}
