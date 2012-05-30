/**
 * @class Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at 
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 * @augments ROT.Map
 */
ROT.Map.Digger = function(width, height, options) {
	ROT.Map.call(this, width, height);
	
	this._rooms = [];
	this._options = {
		roomWidth: [3, 9], /* room minimum and maximum width */
		roomHeight: [3, 5], /* room minimum and maximum height */
		corridorLength: [2, 10] /* corridor minimum and maximum length */
	}
	for (var p in options) { this._options[p] = options[p]; }
	
	this._features = {
		room: 2,
		corridor: 4
	}
	this._featureAttempts = 15; /* how many times do we try to create a feature on a suitable wall */
	this._maxLength = 10; /* max corridor length */
	this._minLength = 2; /* min corridor length */
	this._minSize = 3; /* min room size */
	this._maxWidth = 9; /* max room width */
	this._maxHeight = 5; /* max room height */
	this._dugPercentage = 0.2; /* we stop after this percentage of level area has been dug out */
	
	this._freeWalls = []; /* these are available for digging */
	this._forcedWalls = []; /* these are forced for digging */
}
ROT.Map.Digger.extend(ROT.Map);

ROT.Map.Digger.prototype.create = function(callback) {
	this._map = this._fillMap(1);

	this._freeWalls = []; /* these are available for digging */
	this._forcedWalls = []; /* these are forced for digging */
	this._rooms = [];
	this._dug = 0;

	this._firstRoom();
	var area = (this._width-2) * (this._height-2);

	do {
		/* find a good wall */
		var wall = this._findWall();

		var featureResult = false;
		var featureCount = 0;
		do {
			/* try adding a feature */
			featureResult = this._tryFeature(wall[0], wall[1]);
			featureCount++;
			
			/* feature added, cool */
			if (featureResult) { break; }
			
		} while (featureCount < this._featureAttempts);
	} while (this._dug/area < this._dugPercentage || this._forcedWalls.length);
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, map[i][j]);
		}
	}
	
	this._freeWalls = [];
	this._map = null;

	return this;
}

ROT.Map.Digger.prototype._firstRoom = function() {
	var paddingX = 1 + this._options.roomWidth[0];
	var paddingY = 1 + this._options.roomHeight[0];
	var x1 = 1 + Math.floor(ROT.RNG.getUniform()*(this._width-padding));
	var y1 = 1 + Math.floor(ROT.RNG.getUniform()*(this._height-padding));
	
	
	var availX = this._width - x1 - this._options.roomWidth[0];
	var availY = this._height - y1 - this._options.roomHeight[0];
	
	availX = Math.min(availX, this._options.roomWidth[1] - this._options.roomWidth[0] + 1);
	availY = Math.min(availY, this._options.roomHeight[1] - this._options.roomHeight[0] + 1);
	
	var x2 = x1 + this._options.roomWidth[0] - 1 + Math.floor(ROT.RNG.getUniform()*availX);
	var y2 = x1 + this._options.roomHeight[0] - 1 + Math.floor(ROT.RNG.getUniform()*availY);
	
	this._digRoom(x1, y1, x2, y2);
	this._addSurroundingWalls(x1, y1, x2, y2);
}

/**
 * This _always_ finds a suitable wall.
 * Suitable wall has 3 neighbor walls and 1 neighbor corridor.
 * @returns {RPG.Misc.Coords}
 */
ROT.Map.Digger.prototype._findWall = function() {
	var fw = [];
	for (var id in this._forcedWalls) { fw.push(id); }
	
	if (fw.length) {
		var id = fw.random();
		delete this._forcedWalls[id];
		var parts = id.split(",");
		return [parseInt(parts[0]), parseInt(parts[1])];
	}
	
	var w = [];
	for (var id in this._freeWalls) { w.push(id); }
	if (!w.length) { throw new Error("PANIC! No suitable wall found."); }
	
	var id = w.random();
	var parts = id.split(",");
	/* FIXME should not we delete this wall from this._freeWalls? */
	return [parseInt(parts[0]), parseInt(parts[1])];
}

/**
 * Tries adding a feature
 * @returns {bool} was this a successful try?
 */
ROT.Map.Digger.prototype._tryFeature = function(x, y) {
	var name = this._getFeature();
	var func = this["_feature" + name.charAt(0).toUpperCase() + name.substring(1)];
	if (!func) { throw new Error("PANIC! Non-existant feature '"+name+"'."); }
	
	return func.call(this, x, y);
}

/**
 * Get a random feature name
 */
ROT.Map.Digger.prototype._getFeature = function() {
	var total = 0;
	for (var p in this._features) { total += this._features[p]; }
	var random = Math.floor(ROT.RNG.getUniform()*total);
	
	var sub = 0;
	for (var p in this._features) {
		sub += this._features[p];
		if (random < sub) { return p; }
	}
}

/**
 * Room feature
 */
ROT.Map.Digger.prototype._featureRoom = function(startX, startY) {
	/* corridor vector */
	var direction = this._emptyDirection(x, y);
	var normal = new RPG.Misc.Coords(direction.y, -direction.x);

	var diffX = this._maxWidth - this._minSize + 1;
	var diffY = this._maxHeight - this._minSize + 1;
	var width = Math.floor(ROT.RNG.getUniform() * diffX) + this._minSize;
	var height = Math.floor(ROT.RNG.getUniform() * diffY) + this._minSize;
	
	/* one corner of the room, unshifted */
	var corner1 = wall.clone().plus(direction);
	
	var corner2 = corner1.clone();
	
	if (direction.x > 0 || direction.y > 0) {
		/* corner1 is top-left */
		corner2.x += width - 1;
		corner2.y += height - 1;
	} else {
		/* corner1 is bottom-right, swap */
		corner1.x -= width + 1;
		corner1.y -= height + 1;
	}
	
	/* shifting */
	var shift = 0;
	var prop = "";
	if (direction.x != 0) {
		/* vertical shift */
		prop = "y";
		var diff = height - 2;
		var shift = Math.floor(ROT.RNG.getUniform()*diff)+1;
		if (direction.x > 0) { shift = -shift; }
	} else {
		/* horizontal shift */
		prop = "x";
		var diff = width - 2;
		var shift = Math.floor(ROT.RNG.getUniform()*diff)+1;
		if (direction.y > 0) { shift = -shift; }
	}
	corner1[prop] += shift;
	corner2[prop] += shift;
	
	/* enlarge for testing */
	var c1 = corner1.clone();
	c1.x--;
	c1.y--;
	var c2 = corner2.clone();
	c2.x++;
	c2.y++;

	var ok = this._freeSpace(c1, c2);
	if (!ok) { return false; }
	
	/* dig the wall + room */
	this._dug += 1;
	this._map[wall.x][wall.y] = 0;
	this._digRoom(corner1, corner2);
	
	if (ROT.RNG.getUniform() > 0.7) {
		/* remove corners FIXME independent? all at once? */
		this._map[corner1.x][corner1.y] = 1;
		this._map[corner1.x][corner2.y] = 1;
		this._map[corner2.x][corner1.y] = 1;
		this._map[corner2.x][corner2.y] = 1;
		this._dug -= 4;
	}
	
	/* add to a list of free walls */
	this._addSurroundingWalls(corner1, corner2);
	
	/* remove 3 free walls from entrance */
	this._removeFreeWall(wall);
	var c = wall.clone().plus(normal);
	this._removeFreeWall(c);
	var c = wall.clone().minus(normal);
	this._removeFreeWall(c);

	return true;
}

/**
 * Corridor feature
 */
ROT.Map.Digger.prototype._featureCorridor = function(startX, startY) {
	/* corridor vector */
	var direction = this._emptyDirection(startX, startY);
	var normal = [direction[1], -direction[0]];
	
	/* random length */
	var diff = this._options.corridorLength[1] - this._options.corridorLength[0] + 1;
	var length = Math.floor(ROT.RNG.getUniform() * diff) + this._options.corridorLength[0];
	
	for (var i=1;i<=length;i++) {
		var x = startX + i*direction[0];
		var y = startY + i*direction[1];
		
		if (!this._map[x][y]) { 
			length = i-1;
			break;
		}
		
		if (x < 1 || x+1 == this._width || y < 1 || y+1 == this._height) {
			length = i-1;
			break;
		}
	}
	if (length < this._options.corridorLength[0]) { return false; }
	
	var endX = startX + length*direction[0];
	var endY = startY + length*direction[1];
	
	var left   = Math.min(startX + normal[0], startX - normal[0], endX + normal[0], endX - normal[0]);
	var right  = Math.max(startX + normal[0], startX - normal[0], endX + normal[0], endX - normal[0]);
	var top    = Math.min(startY + normal[1], startY - normal[1], endY + normal[1], endY - normal[1]);
	var bottom = Math.max(startY + normal[1], startY - normal[1], endY + normal[1], endY - normal[1]);
	
	var corner1 = new RPG.Misc.Coords(left, top);
	var corner2 = new RPG.Misc.Coords(right, bottom);

	var ok = this._freeSpace(corner1, corner2);
	if (!ok) { return false; }
	
	/* if the last cell of wall is a corner of a room, cancel */
	for (var i=0;i<this._rooms.length;i++) {
		var room = this._rooms[i];
		var c1 = room.getCorner1();
		var c2 = room.getCorner2();
		if ((end.x == c1.x-1 || end.x == c2.x+1) && (end.y == c1.y-1 || end.y == c2.y+1)) { return false; }
	}
	
	/* dig the wall + corridor */
	this._dug += length;
	var c = start.clone();
	for (var i=0;i<length;i++) {
		this._map[c.x][c.y] = 0;
		c.plus(direction);
	}
	
	/* add forced endings */
	this._forcedWalls = [];
	c = end.clone().plus(direction);
	this._addForcedWall(c);
	c = end.clone().plus(normal);
	this._addForcedWall(c);
	c = end.clone().minus(normal);
	this._addForcedWall(c);
	
	/* remove end cell from free walls */
	this._removeFreeWall(end);

	/* normalize start & end order */
	if (start.x > end.x || start.y > end.y) {
		var tmp = start;
		start = end;
		end = tmp;
	}
	/* sync list of free walls */
	this._addSurroundingWalls(start, end);
	
	/* remove walls that are not free anymore */
	c = wall;
	this._removeFreeWall(c);
	c = wall.clone().plus(normal);
	this._removeFreeWall(c);
	c = wall.clone().minus(normal);
	this._removeFreeWall(c);
	
	return true;
}

/**
 * Adds a new wall to list of available walls
 */
ROT.Map.Digger.prototype._addFreeWall = function(x, y) {
	/* remove if already exists */
	this._removeFreeWall(x, y);
	
	/* is this one ok? */
	var ok = this._emptyDirection(x, y);
	if (!ok) { return; }
	
	/* ok, so let's add it */
	this._freeWalls[x+","+y] = 1;
}

/**
 * Adds a new wall to list of forced walls
 */
ROT.Map.Digger.prototype._addForcedWall = function(x, y) {
	/* is this one ok? */
	var ok = this._emptyDirection(x, y);
	if (!ok) { return; }
	
	/* ok, so let's add it */
	this._forcedWalls[x+","+y] = 1;
}

/**
 * Removes a wall from list of walls
 */
ROT.Map.Digger.prototype._removeFreeWall = function(x, y) {
	var key = x+","+y;
	delete this._freeWalls[key];
}

/**
 * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
 */
ROT.Map.Digger.prototype._emptyDirection = function(cx, cy) {
	var result = null;
	var deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	
	for (var i=0;i<deltas.length;i++) {
		var delta = deltas[i];
		var x = cx + delta[0];
		var y = cy + delta[1];
		
		if (x < 0 || y < 0 || x >= this._width || y >= this._width) { return null; }
		
		if (!this._map[x][y]) { 
			/* there already is another empty neighbor! */
			if (result) { return null; }
			result = delta;
		}
	}
	
	/* no empty neighbor */
	if (!result) { return null; } /* FIXME can not happen? */
	
	return [-result[0], -result[1]];
}

/**
 * For a given rectangular area, adds all relevant surrounding walls to list of free walls
 */
ROT.Map.Digger.prototype._addSurroundingWalls = function(x1, y1, x2, y2) {
	var c = new RPG.Misc.Coords(0, 0);
	var left = x1-1;
	var top = y1-1;
	var right = x2+1;
	var bottom = y2+1;
	
	for (var i=left; i<=right; i++) {
		for (var j=top; j<=bottom; j++) {
			if (i == left || i == right || j == top || j == bottom) {
				this._addFreeWall(i, j);
			}
		}
	}
}

RPG.Map.Digger.prototype._digRoom = function(x1, y1, x2, y2) {
	this._rooms.push([x1, y1, x2, y2]);
	
	for (var i=x1;i<=x2;i++) {
		for (var j=y1;j<=y2;j++) {
			this._map[i][j] = 0;
		}
	}
	
	this._dug += (x2-x1+1) * (y2-y1+1);
}
