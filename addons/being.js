var Being = function() {
	Entity.call(this);

	this._speed = 100;
	this._hp = 10;
}
Being.extend(Entity);

/**
 * Called by the Scheduler
 */
Being.prototype.getSpeed = function() {
	return this._speed;
}

Being.prototype.damage = function(damage) {
	this._hp -= damage;
	if (this._hp <= 0) { this.die(); }
}

Being.prototype.act = function() {
	/* FIXME */
}

Being.prototype.die = function() {
	Game.scheduler.remove(this);
}
