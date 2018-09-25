import Scheduler from "./scheduler.js";
export default class Simple<T = any> extends Scheduler<T> {
    add(item: any, repeat: boolean): this;
    next(): any;
}
