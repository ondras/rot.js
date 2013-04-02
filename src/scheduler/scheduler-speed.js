/**
 * @class Speed-based scheduler
 */
ROT.Scheduler.Speed = function() {
	ROT.Scheduler.call(this);
	this._current = null;
}
ROT.Scheduler.Speed.extend(ROT.Scheduler);

/**
 * @param {object} actor anything with "getSpeed" method
 * @see ROT.Scheduler#addActor
 */
ROT.Scheduler.Speed.prototype.addActor = function(actor) {
	this._queue.add(actor, 1/actor.getSpeed());
	return ROT.Scheduler.prototype.addActor.call(this, actor);
}

/**
 * @param {object} actor anything with "getSpeed" method
 * @see ROT.Scheduler#addEvent
 */
ROT.Scheduler.Speed.prototype.addEvent = function(event) {
	this._queue.add(event, 1/event.getSpeed());
	return ROT.Scheduler.prototype.addEvent.call(this, event);
}

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Speed.prototype.next = function() {
	if (this._current) {
		this._queue.add(this._current, 1/this._current.getSpeed());
	}
	return ROT.Scheduler.prototype.next.call(this);
}
