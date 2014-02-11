var Game = {
	scheduler: null,,
	engine: null,
	player: null,
	level: null,
	
	init: function() {
		window.addEventListener("load", this);
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "load":
				window.removeEventListener("load", this);

				this.scheduler = new ROT.Scheduler.Speed();
				this.engine = new ROT.Engine(this.scheduler);
				this.player = new Player();

				/* FIXME build a level and position a player */
				var level = new Level();
				level.setEntity(this.player, new XY());

				this._switchLevel(level);
				this.engine.start();
			break;
		}
	},
	
	over: function() {
		this.engine.lock();
		/* FIXME show something */
	},

	_switchLevel: function(level) {
		/* remove old beings from the scheduler */
		this.scheduler.clear(); 

		this.level = level;

		/* FIXME draw a level */

		/* add new beings to the scheduler */
		var beings = this.level.getBeings();
		for (var i=0;i<beings.length;i++) {
			this.scheduler.add(beings[i], true);
		}
	}
}

Game.init();
