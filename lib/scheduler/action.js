import Scheduler from "./scheduler.js";
export default class Action extends Scheduler {
    constructor() {
        super();
        this._defaultDuration = 1;
        this._duration = this._defaultDuration;
    }
    add(item, repeat, time) {
        this._queue.add(item, time || this._defaultDuration);
        return super.add(item, repeat);
    }
    clear() {
        this._duration = this._defaultDuration;
        return super.clear();
    }
    remove(item) {
        if (item == this._current) {
            this._duration = this._defaultDuration;
        }
        return super.remove(item);
    }
    next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, this._duration || this._defaultDuration);
            this._duration = this._defaultDuration;
        }
        return super.next();
    }
    setDuration(time) {
        if (this._current) {
            this._duration = time;
        }
        return this;
    }
}
