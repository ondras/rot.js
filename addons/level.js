var Level = function() {
	/* FIXME data structure for storing entities */
}

Level.prototype.setEntity = function(entity, xy) {
	/* FIXME remove from old position, draw */

	entity.setPosition(xy, this); /* propagate position data to the entity itself */

	/* FIXME set new position, draw */
}

Level.prototype.getBeings = function() {
	/* FIXME list of all beings */
}
