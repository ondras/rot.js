/**
 * @class Abstract scheduler
 */
ROT.Scheduler = function() {
	this._queue = new ROT.EventQueue();
	this._actors = [];
	this._events = [];
	this._current = null;
}

/**
 * @param {?} actor
 */
ROT.Scheduler.prototype.addActor = function(actor) {
	this._actors.push(actor);
	return this;
}

/**
 * @param {?} event
 */
ROT.Scheduler.prototype.addEvent = function(event) {
	this._events.push(event);
	return this;
}

/**
 * Clear all actors
 */
ROT.Scheduler.prototype.clear = function() {
	this._queue.clear();
	this._actors = [];
	this._events = [];
	this._current = null;
	return this;
}

/**
 * Remove a previously added actor or event
 * @param {?} actor Actor or event
 */
ROT.Scheduler.prototype.remove = function(actorOrEvent) {
	this._queue.remove(actorOrEvent);

	var index = this._actors.indexOf(actorOrEvent);
	if (index != -1) { this._actors.splice(index, 1); }
	var index = this._events.indexOf(actorOrEvent);
	if (index != -1) { this._events.splice(index, 1); }

	if (this._current == actorOrEvent) { this._current = null; }

	return this;
}

/**
 * Schedule next actor
 * @returns {?}
 */
ROT.Scheduler.prototype.next = function() {
	var scheduled = this._queue.get();
	this._current = scheduled;

	if (scheduled) {
		var index = this._events.indexOf(scheduled);
		if (index != -1) {
			this._events.splice(index, 1);
			this._current = null;
		}
	}

	return scheduled;
}
