/**
 * @class Simple fair scheduler (round-robin style)
 */
ROT.Scheduler.Simple = function() {
	ROT.Scheduler.call(this);
}
ROT.Scheduler.Simple.extend(ROT.Scheduler);

/**
 * @see ROT.Scheduler#addActor
 */
ROT.Scheduler.Simple.prototype.addActor = function(actor) {
	this._queue.add(actor, 0);
	return ROT.Scheduler.prototype.addActor.call(this, actor);
}

/**
 * @see ROT.Scheduler#addEvent
 */
ROT.Scheduler.Simple.prototype.addEvent = function(event) {
	this._queue.add(event, 0);
	return ROT.Scheduler.prototype.addEvent.call(this, event);
}

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Simple.prototype.next = function() {
	if (this._current) {
		this._queue.add(this._current, 0);
	}
	return ROT.Scheduler.prototype.next.call(this);
}
