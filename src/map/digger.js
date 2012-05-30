/**
 * @class Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at 
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm .
 * @augments ROT.Map
 */
ROT.Map.Digger = function(width, height, regularity) {
	ROT.Map.call(this, width, height);
	
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

	this._firstRoom();
	var area = (this._width-2) * (this._height-2);

	do {
		/* find a good wall */
		var wall = this._findWall();

		var featureResult = false;
		var featureCount = 0;
		do {
			/* try adding afeature */
			featureResult = this._tryFeature(wall);
			featureCount++;
			
			/* feature added, cool */
			if (featureResult) { break; }
			
		} while (featureCount < this._featureAttempts);
	} while (this._dug/area < this._dugPercentage || this._forcedWalls.length);
	
	this._freeWalls = [];
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, map[i][j]);
		}
	}
	
	this._map = null;
	return this;
}

ROT.Map.Digger.prototype._firstRoom = function() {
	var corner1 = this._generateCoords(this._minSize);
	var corner2 = this._generateSecondCorner(corner1, this._minSize, this._maxWidth, this._maxHeight);
	
	this._digRoom(corner1, corner2);
	this._addSurroundingWalls(corner1, corner2);
}

/**
 * This _always_ finds a suitable wall.
 * Suitable wall has 3 neighbor walls and 1 neighbor corridor.
 * @returns {RPG.Misc.Coords}
 */
ROT.Map.Digger.prototype._findWall = function() {
	if (this._forcedWalls.length) {
		var forcedWall = this._forcedWalls.random();
		var index = this._forcedWalls.indexOf(forcedWall);
		this._forcedWalls.splice(index, 1);
		return forcedWall;
	} else {
		if (!this._freeWalls.length) { throw new Error("PANIC! No suitable wall found."); }
		return this._freeWalls.random();
	}

	
}

/**
 * Tries adding a feature
 * @returns {bool} was this a successful try?
 */
ROT.Map.Digger.prototype._tryFeature = function(wall) {
	var name = this._getFeature();
	var func = this["_feature" + name.charAt(0).toUpperCase() + name.substring(1)];
	if (!func) { throw new Error("PANIC! Non-existant feature '"+name+"'."); }
	
	return func.call(this, wall);
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
ROT.Map.Digger.prototype._featureRoom = function(wall) {
	/* corridor vector */
	var direction = this._emptyDirection(wall);
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
ROT.Map.Digger.prototype._featureCorridor = function(wall) {
	/* corridor vector */
	var direction = this._emptyDirection(wall);
	var normal = new RPG.Misc.Coords(direction.y, -direction.x);
	
	/* wall length */
	var availSpace = 0;
	var c = wall.clone();
	while (this._isValid(c)) {
		c.x += direction.x;
		c.y += direction.y;
		availSpace++;
	}
	availSpace--;
	
	/* not enough space */
	if (availSpace < this._maxLength) { return false; }
	
	/* random length */
	var diff = this._maxLength - this._minLength + 1;
	var length = Math.floor(ROT.RNG.getUniform() * diff) + this._minLength;
	length = Math.min(length, availSpace);
	
	/* start point */
	var start = wall.clone();
	
	/* end point */
	var end = start.clone();
	for (var i=1;i<length;i++) {
		end.plus(direction);
	}
	
	var left = Math.min(start.x + normal.x, start.x - normal.x, end.x + normal.x, end.x - normal.x);
	var right = Math.max(start.x + normal.x, start.x - normal.x, end.x + normal.x, end.x - normal.x);
	var top = Math.min(start.y + normal.y, start.y - normal.y, end.y + normal.y, end.y - normal.y);
	var bottom = Math.max(start.y + normal.y, start.y - normal.y, end.y + normal.y, end.y - normal.y);
	
	var corner1 = new RPG.Misc.Coords(left, top);
	var corner2 = new RPG.Misc.Coords(right, bottom);

	var ok = this._freeSpace(corner1, corner2);
	if (!ok) { return false; }
	
	/* if the last cell of wall is a corner of a corridor, cancel */
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
ROT.Map.Digger.prototype._addFreeWall = function(coords) {
	/* remove if already exists */
	this._removeFreeWall(coords);
	
	/* is this one ok? */
	var ok = this._emptyDirection(coords);
	if (!ok) { return; }
	
	/* ok, so let's add it */
	this._freeWalls.push(coords.clone());
}

/**
 * Adds a new wall to list of forced walls
 */
ROT.Map.Digger.prototype._addForcedWall = function(coords) {
	/* is this one ok? */
	var ok = this._emptyDirection(coords);
	if (!ok) { return; }
	
	/* ok, so let's add it */
	this._forcedWalls.push(coords.clone());
}

/**
 * Removes a wall from list of walls
 */
ROT.Map.Digger.prototype._removeFreeWall = function(coords) {
	for (var i=0;i<this._freeWalls.length;i++) {
		var wall = this._freeWalls[i];
		if (wall.x == coords.x && wall.y == coords.y) {
			this._freeWalls.splice(i, 1);
			return;
		}
	}
}

/**
 * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
 */
ROT.Map.Digger.prototype._emptyDirection = function(coords) {
	var c = new RPG.Misc.Coords();
	var empty = null;
	var deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	
	for (var i=0;i<deltas.length;i++) {
		c.x = coords.x+deltas[i][0];
		c.y = coords.y+deltas[i][1];
		
		if (!this._isValid(c)) { return false; }
		
		if (!this._map[c.x][c.y]) { 
			/* there already is another empty neighbor! */
			if (empty) { return false; }

			empty = c.clone();
		}
	}
	
	/* no empty neighbor */
	if (!empty) { return false; }
	
	return new RPG.Misc.Coords(coords.x - empty.x, coords.y - empty.y);
}

/**
 * For a given rectangular area, adds all relevant surrounding walls to list of free walls
 */
ROT.Map.Digger.prototype._addSurroundingWalls = function(corner1, corner2) {
	var c = new RPG.Misc.Coords(0, 0);
	var left = corner1.x-1;
	var right = corner2.x+1;
	var top = corner1.y-1;
	var bottom = corner2.y+1;
	
	for (var i=left;i<=right;i++) {
		for (var j=top;j<=bottom;j++) {
			if (i == left || i == right || j == top || j == bottom) {
				c.x = i;
				c.y = j;
				this._addFreeWall(c);
			}
		}
	}
}
