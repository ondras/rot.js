import Scheduler from "./scheduler.js";
interface SpeedActor {
    getSpeed: () => number;
}
export default class Speed<T extends SpeedActor = SpeedActor> extends Scheduler<T> {
    add(item: T, repeat: boolean, time?: number): this;
    next(): any;
}
export {};
