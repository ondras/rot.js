/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */
ROT.FOV.RecursiveShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
}
ROT.FOV.RecursiveShadowcasting.extend(ROT.FOV);

/** Octants used for translating recursive shadowcasting offsets */
ROT.FOV.RecursiveShadowcasting.OCTANTS = [
	[-1,  0,  0,  1],
	[ 0, -1,  1,  0],
	[ 0, -1, -1,  0],
	[-1,  0,  0, -1],
	[ 1,  0,  0, -1],
	[ 0,  1, -1,  0],
	[ 0,  1,  1,  0],
	[ 1,  0,  0,  1]
];

/**
 * Compute visibility for a 360-degree circle
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute = function(x, y, R, callback, initialValue) {
	//You can always see your own tile
	var accumulator = callback(x, y, 0, 1, initialValue);
	for(var i = 0; i < ROT.FOV.RecursiveShadowcasting.OCTANTS.length; i++) {
		accumulator = this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[i], R, callback, accumulator);
	}
	return accumulator;
}

/**
 * Compute visibility for a 180-degree arc
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute180 = function(x, y, R, dir, callback, initialValue) {
	//You can always see your own tile
	accumulator = callback(x, y, 0, 1, initialValue);
	var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
	var nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
	var nextOctant = (dir+ 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
	accumulator = this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextPreviousOctant], R, callback, accumulator);
	accumulator = this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback, accumulator);
	accumulator = this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback, accumulator);
	return this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextOctant], R, callback, accumulator);
}

/**
 * Compute visibility for a 90-degree arc
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute90 = function(x, y, R, dir, callback, initialValue) {
	//You can always see your own tile
	var accumulator = callback(x, y, 0, 1, initialValue);
	var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
	accumulator = this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback, accumulator);
	return this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback, accumulator);
}

/**
 * Render one octant (45-degree arc) of the viewshed
 * @param {int} x
 * @param {int} y
 * @param {int} octant Octant to be rendered
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype._renderOctant = function(x, y, octant, R, callback, accumulator) {
	//Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
	return this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback, accumulator);
}

/**
 * Actually calculates the visibility
 * @param {int} startX The starting X coordinate
 * @param {int} startY The starting Y coordinate
 * @param {int} row The row to render
 * @param {float} visSlopeStart The slope to start at
 * @param {float} visSlopeEnd The slope to end at
 * @param {int} radius The radius to reach out to
 * @param {int} xx
 * @param {int} xy
 * @param {int} yx
 * @param {int} yy
 * @param {function} callback The callback to use when we hit a block that is visible
 */
ROT.FOV.RecursiveShadowcasting.prototype._castVisibility = function(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback, accumulator) {
	if(visSlopeStart < visSlopeEnd) { return accumulator; }
	for(var i = row; i <= radius; i++) {
		var dx = -i - 1;
		var dy = -i;
		var blocked = false;
		var newStart = 0;

		//'Row' could be column, names here assume octant 0 and would be flipped for half the octants
		while(dx <= 0) {
			dx += 1;

			//Translate from relative coordinates to map coordinates
			var mapX = startX + dx * xx + dy * xy;
			var mapY = startY + dx * yx + dy * yy;

			//Range of the row
			var slopeStart = (dx - 0.5) / (dy + 0.5);
			var slopeEnd = (dx + 0.5) / (dy - 0.5);

			//Ignore if not yet at left edge of Octant
			if(slopeEnd > visSlopeStart) { continue; }

			//Done if past right edge
			if(slopeStart < visSlopeEnd) { break; }

			//If it's in range, it's visible
			if((dx * dx + dy * dy) < (radius * radius)) {
				accumulator = callback(mapX, mapY, i, 1, accumulator);
			}

			if(!blocked) {
				//If tile is a blocking tile, cast around it
				if(!this._lightPasses(mapX, mapY) && i < radius) {
					blocked = true;
					accumulator = this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback, accumulator);
					newStart = slopeEnd;
				}
			} else {
				//Keep narrowing if scanning across a block
				if(!this._lightPasses(mapX, mapY)) {
					newStart = slopeEnd;
					continue;
				}

				//Block has ended
				blocked = false;
				visSlopeStart = newStart;
			}
		}
		if(blocked) { break; }
	}
	return accumulator;
}
