import Scheduler from "./scheduler/scheduler.js";
export default class Engine {
    _scheduler: Scheduler;
    _lock: number;
    constructor(scheduler: Scheduler);
    start(): this;
    lock(): this;
    unlock(): this;
}
