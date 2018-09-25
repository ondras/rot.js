export default class EventQueue {
    constructor() {
        this._time = 0;
        this._events = [];
        this._eventTimes = [];
    }
    getTime() { return this._time; }
    clear() {
        this._events = [];
        this._eventTimes = [];
        return this;
    }
    add(event, time) {
        let index = this._events.length;
        for (let i = 0; i < this._eventTimes.length; i++) {
            if (this._eventTimes[i] > time) {
                index = i;
                break;
            }
        }
        this._events.splice(index, 0, event);
        this._eventTimes.splice(index, 0, time);
    }
    get() {
        if (!this._events.length) {
            return null;
        }
        let time = this._eventTimes.splice(0, 1)[0];
        if (time > 0) {
            this._time += time;
            for (let i = 0; i < this._eventTimes.length; i++) {
                this._eventTimes[i] -= time;
            }
        }
        return this._events.splice(0, 1)[0];
    }
    getEventTime(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return undefined;
        }
        return this._eventTimes[index];
    }
    remove(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return false;
        }
        this._remove(index);
        return true;
    }
    ;
    _remove(index) {
        this._events.splice(index, 1);
        this._eventTimes.splice(index, 1);
    }
    ;
}
