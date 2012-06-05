/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map
 */
ROT.Map.Uniform = function(width, height, options) {
	ROT.Map.call(this, width, height);

	this._options = {
		roomWidth: [3, 9], /* room minimum and maximum width */
		roomHeight: [3, 5], /* room minimum and maximum height */
		roomDugPercentage: 0.15, /* we stop after this percentage of level area has been dug out by rooms */
		timeLimit: 500, /* we stop after this much time has passed (msec) */
	}
	for (var p in options) { this._options[p] = options[p]; }

	this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
	this._corridorAttempts = 50; /* corridors are tried N-times until the level is considered as impossible to connect */

	this._rooms = []; /* list of all rooms */
	this._connected = []; /* list of already connected rooms */
	this._unconnected = []; /* list of remaining unconnected rooms */
	
	this._digCallback = this._digCallback.bind(this);
	this._canBeDugCallback = this._canBeDugCallback.bind(this);
	this._isWallCallback = this._isWallCallback.bind(this);
}
ROT.Map.Uniform.extend(ROT.Map);

ROT.Map.Uniform.prototype.create = function(callback) {
	var t1 = Date.now();
	while (1) {
		var t2 = Date.now();
		if (t2 - t1 > this._options.timeLimit) { console.log("time limit"); break; /* FIXME */ }
	
		this._map = this._fillMap(1);
		this._dug = 0;
		this._rooms = [];
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

/**
 * Generates a suitable amount of rooms
 */
ROT.Map.Uniform.prototype._generateRooms = function() {
	var w = this._width-2;
	var h = this._height-2;

	do {
		var room = this._generateRoom();
		if (this._dug/(w*h) > this._options.roomDugPercentage) { break; } /* achieved requested amount of free space */
	} while (room);

	/* either enough rooms, or not able to generate more of them :) */
}

/**
 * Try to generate one room
 */
ROT.Map.Uniform.prototype._generateRoom = function() {
	var count = 0;
	while (count < this._roomAttempts) {
		count++;
		
		var room = ROT.Map.Feature.Room.createRandom(this._width, this._height, this._options);
		if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) { continue; }
		
		room.create(this._digCallback);
		this._unconnected.push(room);
		this._rooms.push(room);
		return room;
	} 

	/* no room was generated in a given number of attempts */
	return null;
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
		this._connected.sort(function(a, b){ /* find closest connected */
			var ac = a.getCenter();
			var bc = b.getCenter();
			
			var adx = ac[0]-center[0];
			var ady = ac[1]-center[1];
			var bdx = bc[0]-center[0];
			var bdy = bc[1]-center[1];
			
			return adx*adx+ady*ady - bdx*bdx+bdy*bdy;
		});
		var room2 = this._connected[0];

		this._connectRooms(room1, room2); /* connect these two */
	};
	
	return true;
}

ROT.Map.Uniform.prototype._connectRooms = function(room1, room2) {
//	console.log("connecting");
//	room1.debug();
//	room2.debug();
	var center1 = room1.getCenter();
	var center2 = room2.getCenter();

	var diffX = center2[0] - center1[0];
	var diffY = center2[1] - center1[1];

	if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
		var dirIndex1 = (diffY > 0 ? 2 : 0);
		var dirIndex2 = (dirIndex1 + 2) % 4;
		var min = room2.getLeft();
		var max = room2.getRight();
		var index = 0;
	} else { /* first try connecting east-west walls */
		var dirIndex1 = (diffX > 0 ? 1 : 3);
		var dirIndex2 = (dirIndex1 + 2) % 4;
		var min = room2.getTop();
		var max = room2.getBottom();
		var index = 1;
	}

	var start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
	if (!start) { return; }

	if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
		var end = start.clone();
		var value = null;
		switch (dirIndex2) {
			case 0: value = room2.getTop()-1; break;
			case 1: value = room2.getRight()+1; break;
			case 2: value = room2.getBottom()+1; break;
			case 3: value = room2.getLeft()-1; break;
		}
		end[(index+1)%2] = value;
		return this._digLine([start, end]);
		
	} else if (start[index] < min-1 || start[index] > max+1) { /* need to switch target wall (L-like) */

		var diff = start[index] - center2[index];
		switch (dirIndex2) {
			case 0:
			case 1:	var rotation = (diff < 0 ? 3 : 1); break;
			break;
			case 2:
			case 3:	var rotation = (diff < 0 ? 1 : 3); break;
			break;
		}
		dirIndex2 = (dirIndex2 + rotation) % 4;
		
		var end = this._placeInWall(room2, dirIndex2);
		if (!end) { return; }

		var mid = [0, 0];
		mid[index] = start[index];
		var index2 = (index+1)%2;
		mid[index2] = end[index2];
		return this._digLine([start, mid, end]);
		
	} else { /* use current wall pair, but adjust the line in the middle (S-like) */
	
		var index2 = (index+1)%2;
		var end = this._placeInWall(room2, dirIndex2);
		if (!end) { return; }
		var mid = Math.round((end[index2] + start[index2])/2);

		var mid1 = [0, 0];
		var mid2 = [0, 0];
		mid1[index] = start[index];
		mid1[index2] = mid;
		mid2[index] = end[index];
		mid2[index2] = mid;
		return this._digLine([start, mid1, mid2, end]);

	}
}

ROT.Map.Uniform.prototype._placeInWall = function(room, dirIndex) {
	var wall = room.getRandomWall(dirIndex);
	
	/* must have exactly one free neighbor */
	var dirs = [
		[ 0, -1],
		[ 0,  1],
		[-1,  0],
		[ 1,  0]
	];
	var emptyCount = 0;
	for (var i=0;i<dirs.length;i++) {
		var nx = wall[0] + dirs[i][0];
		var ny = wall[1] + dirs[i][1];
		if (nx < 0 || nx >= this._width || ny < 0 || ny >= this._height) { continue; }
		if (!this._map[nx][ny]) { emptyCount++; }
	}
	
	if (emptyCount != 1) { return null; }
	return wall;
}

/**
 * Try to dig a polyline. Stop if it crosses any room more than two times.
 */
ROT.Map.Uniform.prototype._digLine = function(points) {
	var todo = [];
	var rooms = []; /* rooms crossed with this line */
	
	/**
	 * @private
	 */
	var check = function(x, y) {
		todo.push([x, y]);
		rooms = rooms.concat(this._roomsWithWall(x, y));
	}
	
	/* compute and check all coords on this polyline */
	var x = points[0][0];
	var y = points[0][1];
	points.shift();

	while (points.length) {
		var target = points.shift();
		var diffX = target[0] - x;
		var diffY = target[1] - y;
		var length = Math.max(Math.abs(diffX), Math.abs(diffY));
		var stepX = Math.round(diffX / length);
		var stepY = Math.round(diffY / length);
		for (var i=0;i<length;i++) {
			check.call(this, x, y);
			x += stepX;
			y += stepY;
		}
	}
	check.call(this, x, y);
	
	/* any room violated? */
	var connected = [];
	while (rooms.length) {
		var room = rooms.pop();
		connected.push(room);
		var count = 1;
		var index = rooms.indexOf(room);
		if (index != -1) { return; }
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
		this._map[coords[0]][coords[1]] = 0;
	}
}

/**
 * Returns a list of rooms which have this wall
 */
ROT.Map.Uniform.prototype._roomsWithWall = function(x, y) {
	var result = [];
	for (var i=0;i<this._rooms.length;i++) {
		var room = this._rooms[i];
		if (room.hasWall(x, y)) { result.push(room); }
	}
	return result;
}

ROT.Map.Uniform.prototype._digCallback = function(x, y, value) {
	if (value != 0) { return; }
	this._map[x][y] = 0;
	this._dug++;
}

ROT.Map.Uniform.prototype._isWallCallback = function(x, y) {
	if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return false; }
	return (this._map[x][y] == 1);
}

ROT.Map.Uniform.prototype._canBeDugCallback = function(x, y) {
	if (x < 1 || y < 1 || x+1 >= this._width || y+1 >= this._height) { return false; }
	return (this._map[x][y] == 1);
}

