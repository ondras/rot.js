class Being extends Entity {
	constructor(visual) {
		super(visual);
		this._speed = 100;
		this._hp = 10;
	}

	/**
	 * Called by the Scheduler
	 */
	getSpeed() { return this._speed; }

	damage(damage) {
		this._hp -= damage;
		if (this._hp <= 0) { this.die(); }
	}

	act() { /* FIXME */ }

	die() { Game.scheduler.remove(this); }

	setPosition(xy, level) {
		// came to a currently active level; add self to the scheduler 
		if (level != this._level && level == Game.level) {
			Game.scheduler.add(this, true);
		}

		return super.setPosition(xy, level);
	}
}
