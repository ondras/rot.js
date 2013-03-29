/**
 * @class Speed-based scheduler
 */
ROT.Scheduler = function() {
	this._items = [];
	this._queue = new ROT.EventQueue();
}

/**
 * @param {object} item anything with "getSpeed" method
 */
ROT.Scheduler.prototype.add = function(item) {
	this._items.push(item);
	this._queue.add(item, 1/item.getSpeed());

	return this;
}

/**
 * Clear all actors
 */
ROT.Scheduler.prototype.clear = function() {
	this._items = [];
	this._queue.clear();
	return this;
}

/**
 * Remove a previously added item
 * @param {object} item anything with "getSpeed" method
 */
ROT.Scheduler.prototype.remove = function(item) {
	this._queue.remove(item);
	var index = this._items.indexOf(item);
	this._items.splice(index, 1);

	return this;
}

/**
 * Schedule next actor
 * @returns {object}
 */
ROT.Scheduler.prototype.next = function() {
	if (!this._items.length) { return null; }

	var item = this._queue.get();
	this._queue.add(item, 1/item.getSpeed());

	return item;
}
