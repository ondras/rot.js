/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map
 */
ROT.Map.Uniform = function(width, height) {
	ROT.Map.call(this, width, height);

	this._roomAttempts = 10; /* new room is created N-times until is considered as impossible to generate */
	this._corridorAttempts = 50; /* corridors are tried N-times until the level is considered as impossible to connect */
	this._roomPercentage = 0.1; /* we stop createing rooms after this percentage of level area has been dug out */
	this._minSize = 3; /* minimum room dimension */
	this._maxWidth = 9; /* maximum room width */
	this._maxHeight = 5; /* maximum room height */
	
	this._connected = []; /* list of already connected rooms */
	this._unconnected = []; /* list of remaining unconnected rooms */
}
ROT.Map.Uniform.extend(ROT.Map);

ROT.Map.Uniform.prototype.create = function(callback) {
	while (1) { /* FIXME infinite loop, not good */
		this._map = this._fillMap(1);
		this._unconnected = [];
		this._generateRooms();
		if (this._generateCorridors()) { break; }
	}
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, this._map[i][j]);
		}
	}
	
	return this;
}

ROT.Map.Uniform.prototype._digRoom = function(c1, c2) {
	var room = this.parent(c1, c2);
	this._unconnected.push(room);
}

/**
 * Generates a suitable amount of rooms
 */
ROT.Map.Uniform.prototype._generateRooms = function() {
	var w = this._size.x-2;
	var h = this._size.y-2;

	do {
		var result = this._generateRoom();
		if (this._dug/(w*h) > this._roomPercentage) { break; } /* achieved requested amount of free space */
	} while (result);
	
	/* either enough rooms, or not able to generate more of them :) */
}

/**
 * Try to generate one room
 */
ROT.Map.Uniform.prototype._generateRoom = function() {
	var count = 0;
	while (count < this._roomAttempts) {
		count++;
		
		/* generate corner */
		var corner1 = this._generateCoords(this._minSize);
		
		/* generate second corner */
		var corner2 = this._generateSecondCorner(corner1, this._minSize, this._maxWidth, this._maxHeight);
		
		/* enlarge for fitting */
		corner1.x--;
		corner1.y--;
		corner2.x++;
		corner2.y++;
		
		/* if not good, skip to next attempt */
		if (!this._freeSpace(corner1, corner2)) { continue; }
		
		/* shrink */
		corner1.x++;
		corner1.y++;
		corner2.x--;
		corner2.y--;
		this._digRoom(corner1, corner2);
		return true;
	} 

	/* no room was generated in a given number of attempts */
	return false;
}

/**
 * Generates connectors beween rooms
 * @returns {bool} success Was this attempt successfull?
 */
ROT.Map.Uniform.prototype._generateCorridors = function() {
	var cnt = 0;
	this._connected = [];
	if (this._unconnected.length) { this._connected.push(this._unconnected.pop()); }
		
	while (this._unconnected.length) {
		cnt++;
		if (cnt > this._corridorAttempts) { return false; } /* no success */
		
		var room1 = this._unconnected[0]; /* start with the first unconnected */
		var center = room1.getCenter();
		this._connected.sort(function(a,b){ /* find closest connected */
			return a.getCenter().distance(center) - b.getCenter().distance(center);
		});
		var room2 = this._connected[0];

		this._connectRooms(room1, room2); /* connect these two */
	};
	
	return true;
}

ROT.Map.Uniform.prototype._connectRooms = function(room1, room2) {
	var center1 = room1.getCenter();
	var center2 = room2.getCenter();

	var diffX = center2.x - center1.x;
	var diffY = center2.y - center1.y;
	var prop = "";

	if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
		var wall1 = (diffY > 0 ? RPG.S : RPG.N);
		var wall2 = (wall1 + 4) % 8;
		prop = "x";
	} else { /* first try connecting east-west walls */
		var wall1 = (diffX > 0 ? RPG.E : RPG.W);
		var wall2 = (wall1 + 4) % 8;
		prop = "y";
	}

	var minorProp = (prop == "x" ? "y" : "x");
	var min = room2.getCorner1()[prop];
	var max = room2.getCorner2()[prop];	
	var start = this._placeInWall(room1, wall1); /* corridor will start here */
	if (!start) { return; }

	if (start[prop] >= min && start[prop] <= max) { /* possible to connect with straight line */

		var corner = (wall2 == RPG.N || wall2 == RPG.W ? room2.getCorner1() : room2.getCorner2());
		var x = (prop == "x" ? start[prop] : corner.x);
		var y = (prop == "y" ? start[prop] : corner.y);
		var end = new RPG.Misc.Coords(x, y);
		return this._digLine([start, end]);
		
	} else if (start[prop] < min-1 || start[prop] > max+1) { /* need to switch target wall (L-like) */
		
		var diff = start[prop] - center2[prop];
		switch (wall2) {
			case RPG.N:
			case RPG.E:	var rotation = (diff < 0 ? 6 : 2); break;
			break;
			case RPG.S:
			case RPG.W:	var rotation = (diff < 0 ? 2 : 6); break;
			break;
		}
		wall2 = (wall2 + rotation) % 8;
		
		var end = this._placeInWall(room2, wall2);
		if (!end) { return; }
		var mid = new RPG.Misc.Coords(0, 0);
		mid[prop] = start[prop];
		mid[minorProp] = end[minorProp];
		return this._digLine([start, mid, end]);
		
	} else { /* use current wall pair, but adjust the line in the middle (snake-like) */
	
		var end = this._placeInWall(room2, wall2);
		if (!end) { return; }
		var mid = Math.round((end[minorProp] + start[minorProp])/2);

		var mid1 = new RPG.Misc.Coords(0, 0);
		var mid2 = new RPG.Misc.Coords(0, 0);
		mid1[prop] = start[prop];
		mid1[minorProp] = mid;
		mid2[prop] = end[prop];
		mid2[minorProp] = mid;
		return this._digLine([start, mid1, mid2, end]);

	}
}

ROT.Map.Uniform.prototype._placeInWall = function(room, wall) {
	var prop = "";
	var c1 = room.getCorner1();
	var c2 = room.getCorner2();
	var x = 0;
	var y = 0;
	switch (wall) {
		case RPG.N:
			y = c1.y-1;
			x = c1.x + Math.floor(ROT.RNG.getUniform() * (c2.x-c1.x));
			prop = "x";
		break;
		case RPG.S:
			y = c2.y+1;
			x = c1.x + Math.floor(ROT.RNG.getUniform() * (c2.x-c1.x));
			prop = "x";
		break;
		case RPG.W:
			x = c1.x-1;
			y = c1.y + Math.floor(ROT.RNG.getUniform() * (c2.y-c1.y));
			prop = "y";
		break;
		case RPG.E:
			x = c2.x+1;
			y = c1.y + Math.floor(ROT.RNG.getUniform() * (c2.y-c1.y));
			prop = "y";
		break;
	}
	
	var result = new RPG.Misc.Coords(x, y);
	/* check if neighbors are not empty */
	result[prop] -= 1;
	if (this._isValid(result) && !this._map[result.x][result.y]) { return null; }
	result[prop] += 2;
	if (this._isValid(result) && !this._map[result.x][result.y]) { return null; }
	result[prop] -= 1;

	return result;
}

/**
 * Try to dig a polyline. Stop if it crosses any room more than two times.
 */
ROT.Map.Uniform.prototype._digLine = function(points) {
	var todo = [];
	var rooms = []; /* rooms crossed with this line */
	
	var check = function(coords) {
		todo.push(coords.clone());
		rooms = rooms.concat(this._roomsWithWall(coords));
	}
	
	/* compute and check all coords on this polyline */
	var current = points.shift();
	while (points.length) {
		var target = points.shift();
		var diffX = target.x - current.x;
		var diffY = target.y - current.y;
		var length = Math.max(Math.abs(diffX), Math.abs(diffY));
		var stepX = Math.round(diffX / length);
		var stepY = Math.round(diffY / length);
		for (var i=0;i<length;i++) {
			check.call(this, current);
			current.x += stepX;
			current.y += stepY;
		}
	}
	check.call(this, current);
	
	/* any room violated? */
	var connected = [];
	while (rooms.length) {
		var room = rooms.pop();
		connected.push(room);
		var count = 1;
		for (var i=rooms.length-1; i>=0; i--) {
			if (rooms[i] == room) {
				rooms.splice(i, 1);
				count++;
			}
		}
		if (count > 2) { return; } /* room crossed too many times */
	}
	
	/* mark encountered rooms as connected */
	while (connected.length) {
		var room = connected.pop();
		var index = this._unconnected.indexOf(room);
		if (index != -1) { 
			this._unconnected.splice(index, 1);
			this._connected.push(room);
		}
	}
	
	while (todo.length) { /* do actual digging */
		var coords = todo.pop();
		this._map[coords.x][coords.y] = 0;
	}
}

/**
 * Returns a list of rooms which have this wall
 */
ROT.Map.Uniform.prototype._roomsWithWall = function(coords) {
	var result = [];
	for (var i=0;i<this._rooms.length;i++) {
		var room = this._rooms[i];
		var ok = false;
		var c1 = room.getCorner1();
		var c2 = room.getCorner2();
		
		if ( /* one of vertical walls */
			(coords.x+1 == c1.x || coords.x-1 == c2.x) 
			&& coords.y+1 >= c1.y 
			&& coords.y-1 <= c2.y
		) { ok = true; }
		
		if ( /* one of horizontal walls */
			(coords.y+1 == c1.y || coords.y-1 == c2.y) 
			&& coords.x+1 >= c1.x 
			&& coords.x-1 <= c2.x
		) { ok = true; }

		if (ok) { result.push(room); }		
	}
	return result;
}
