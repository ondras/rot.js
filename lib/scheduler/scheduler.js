import EventQueue from "../eventqueue.js";
export default class Scheduler {
    constructor() {
        this._queue = new EventQueue();
        this._repeat = [];
        this._current = null;
    }
    getTime() { return this._queue.getTime(); }
    add(item, repeat) {
        if (repeat) {
            this._repeat.push(item);
        }
        return this;
    }
    getTimeOf(item) {
        return this._queue.getEventTime(item);
    }
    clear() {
        this._queue.clear();
        this._repeat = [];
        this._current = null;
        return this;
    }
    remove(item) {
        let result = this._queue.remove(item);
        let index = this._repeat.indexOf(item);
        if (index != -1) {
            this._repeat.splice(index, 1);
        }
        if (this._current == item) {
            this._current = null;
        }
        return result;
    }
    next() {
        this._current = this._queue.get();
        return this._current;
    }
}
