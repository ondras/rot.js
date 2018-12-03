import Scheduler from "./scheduler.js";

export interface SpeedActor {
	getSpeed: () => number;
}

/**
 * @class Speed-based scheduler
 */
export default class Speed<T extends SpeedActor = SpeedActor> extends Scheduler<T> {
	/**
	 * @param {object} item anything with "getSpeed" method
	 * @param {bool} repeat
	 * @param {number} [time=1/item.getSpeed()]
	 * @see ROT.Scheduler#add
	 */
	add(item:T, repeat:boolean, time?:number) {
		this._queue.add(item, time !== undefined ? time : 1/item.getSpeed());
		return super.add(item, repeat);
	}

	/**
	 * @see ROT.Scheduler#next
	 */
	next() {
		if (this._current && this._repeat.indexOf(this._current) != -1) {
			this._queue.add(this._current, 1/this._current.getSpeed());
		}
		return super.next();
	}
}
