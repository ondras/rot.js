export default class Engine {
    constructor(scheduler) {
        this._scheduler = scheduler;
        this._lock = 1;
    }
    start() { return this.unlock(); }
    lock() {
        this._lock++;
        return this;
    }
    unlock() {
        if (!this._lock) {
            throw new Error("Cannot unlock unlocked engine");
        }
        this._lock--;
        while (!this._lock) {
            let actor = this._scheduler.next();
            if (!actor) {
                return this.lock();
            }
            let result = actor.act();
            if (result && result.then) {
                this.lock();
                result.then(this.unlock.bind(this));
            }
        }
        return this;
    }
}
