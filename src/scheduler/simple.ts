import Scheduler from "./scheduler.js";

/**
 * @class Simple fair scheduler (round-robin style)
 */
export default class Simple<T = any> extends Scheduler<T> {
	add(item: any, repeat: boolean) {
		this._queue.add(item, 0);
		return super.add(item, repeat);
	}

	next() {
		if (this._current && this._repeat.indexOf(this._current) != -1) {
			this._queue.add(this._current, 0);
		}
		return super.next();
	}
}
