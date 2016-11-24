/**
 * @class Speed-based scheduler
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Speed = function() {
	ROT.Scheduler.call(this);
};
ROT.Scheduler.Speed.extend(ROT.Scheduler);

/**
 * @param {object} item anything with "getSpeed" method
 * @param {bool} repeat
 * @param {number} [time=1/item.getSpeed()]
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Speed.prototype.add = function(item, repeat, time) {
	this._queue.add(item, time !== undefined ? time : 1/item.getSpeed());
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
};

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Speed.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, 1/this._current.getSpeed());
	}
	return ROT.Scheduler.prototype.next.call(this);
};
