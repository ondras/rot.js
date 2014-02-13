var Game = {
	scheduler: null,
	engine: null,
	player: null,
	level: null,
	display: null,
	
	init: function() {
		window.addEventListener("load", this);
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "load":
				window.removeEventListener("load", this);

				this.scheduler = new ROT.Scheduler.Speed();
				this.engine = new ROT.Engine(this.scheduler);
				this.display = new ROT.Display();
				document.body.appendChild(this.display.getContainer());
				this.player = new Player();

				/* FIXME build a level and position a player */
				var level = new Level();
				var size = level.getSize();
				this._switchLevel(level);
				this.level.setEntity(this.player, new XY(Math.round(size.x/2), Math.round(size.y/2)));

				this.engine.start();
			break;
		}
	},

	draw: function(xy) {
		var entity = this.level.getEntityAt(xy);
		var visual = entity.getVisual();
		this.display.draw(xy.x, xy.y, visual.ch, visual.fg, visual.bg);
	},
	
	over: function() {
		this.engine.lock();
		/* FIXME show something */
	},

	_switchLevel: function(level) {
		/* remove old beings from the scheduler */
		this.scheduler.clear(); 

		this.level = level;
		var size = this.level.getSize();
		this.display.setOptions({width:size.x, height:size.y});

		/* FIXME draw a level */
		var xy = new XY();
		for (var i=0;i<size.x;i++) {
			xy.x = i;
			for (var j=0;j<size.y;j++) {
				xy.y = j;
				this.draw(xy);
			}
		}

		/* add new beings to the scheduler */
		var beings = this.level.getBeings();
		for (var p in beings) {
			this.scheduler.add(beings[p], true);
		}
	}
}

Game.init();
