import Scheduler from "./scheduler/scheduler.js";
/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
export default class Engine {
    _scheduler: Scheduler;
    _lock: number;
    constructor(scheduler: Scheduler);
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */
    start(): this;
    /**
     * Interrupt the engine by an asynchronous action
     */
    lock(): this;
    /**
     * Resume execution (paused by a previous lock)
     */
    unlock(): this;
}
