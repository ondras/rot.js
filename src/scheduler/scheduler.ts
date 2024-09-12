import EventQueue from "../eventqueue.js";

export default class Scheduler<T = any> {
	_queue: EventQueue<T>;
	_repeat: T[];
	_current: T | null;

	/**
	 * @class Abstract scheduler
	 */
	constructor() {
		this._queue = new EventQueue<T>();
		this._repeat = [];
		this._current = null;
	}

	/**
	 * @see ROT.EventQueue#getTime
	 */
	getTime() { return this._queue.getTime(); }

	/**
	 * @param {?} item
	 * @param {bool} repeat
	 */
	add(item:T, repeat:boolean) {
		if (repeat) { this._repeat.push(item); }
		return this;
	}

	/**
	 * Get the time the given item is scheduled for
	 * @param {?} item
	 * @returns {number} time
	 */
	getTimeOf(item: T) {
		return this._queue.getEventTime(item);
	}

	/**
	 * Clear all items
	 */
	clear() {
		this._queue.clear();
		this._repeat = [];
		this._current = null;
		return this;
	}

	/**
	 * Remove a previously added item
	 * @param {?} item
	 * @returns {bool} successful?
	 */
	remove(item: T) {
		let result = this._queue.remove(item);

		let index = this._repeat.indexOf(item);
		if (index != -1) { this._repeat.splice(index, 1); }

		if (this._current == item) { this._current = null; }

		return result;
	}

	/**
	 * Schedule next item
	 * @returns {?}
	 */
	next() {
		this._current = this._queue.get();
		return this._current;
	}
}
