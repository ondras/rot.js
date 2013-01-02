var L = function() { return console.log.apply(console, arguments); }

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
ROT.FOV.PreciseShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
}
ROT.FOV.PreciseShadowcasting.extend(ROT.FOV);

/**
 * @see ROT.FOV#compute
 */
ROT.FOV.PreciseShadowcasting.prototype.compute = function(x, y, R, callback) {
	/* this place is always visible */
	callback(x, y, 0);

	/* standing in a dark place. FIXME is this a good idea?  */
	if (!this._lightPasses(x, y)) { return; }
	
	/* list of all shadows */
	var SHADOWS = [];
	
	var cx, cy, blocks, arc;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		L("circle at r=", r);
		var neighbors = this._getCircle(x, y, r);
		var neighborCount = neighbors.length;

		for (var i=0;i<neighborCount;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			arc = [i ? 2*i-1 : 2*neighborCount-1, 2*neighborCount, 2*i+1, 2*neighborCount]; /* shift half-an-angle backwards to maintain consistency of 0-th cells */
			L("new arc", arc);
			
			blocks = !this._lightPasses(cx, cy);
			if (this._visibleCoords(arc, blocks, SHADOWS)) { callback(cx, cy, r); }

			if (SHADOWS.length == 1 && SHADOWS[0][0] == 0 && SHADOWS[0][2] == SHADOWS[0][3]) { L("cutoff at", SHADOWS); return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
}

/**
 * @param {int[4]} arc
 * @param {bool} blocks Does current cell block visibility?
 * @param {int[][]} SHADOWS list of active shadows
 */
ROT.FOV.PreciseShadowcasting.prototype._visibleCoords = function(arc, blocks, SHADOWS) {
	L("checking arc", arc, "whose blocking is", blocks);
	if (arc[0] > arc[2]) {
		L("zero encountered - splitting into two");
		var v1 = arguments.callee([arc[0], arc[1], arc[1], arc[1]], blocks, SHADOWS);
		var v2 = arguments.callee([0, 1, arc[2], arc[3]], blocks, SHADOWS);
		return (v1 || v2);
	}

	var old, index = 0;
	while (index < SHADOWS.length) {
		old = SHADOWS[index++];
		/* note that the old shadow is always >= new arc. this is important, as it eliminates certain problematic cases */

		if (old[0]*arc[3] > arc[2]*old[1]) { /* old shadow starts completely after this one */
			L("inserting before old shadow", old);
			if (blocks) { SHADOWS.splice(index-1, 0, arc); }
			return true;

		} else if (old[0]*arc[1] >= arc[0]*old[1]) { /* old shadow starts within this arc */

			/* there is an overlap:
			 * 1) this arc and old shadow share the starting point
			 * 2) old shadow starts in this one
			 */

			if (old[0]*arc[1] == arc[0]*old[1]) { L("completely obstructed by", old); return false; } /* case #1, shared first edge, old is >= this one => consumed, not visible */

			/* case #2, old shadow starts inside of this arc, enlarge it */
			if (blocks) {
				L("enlarging old", old);
				old[0] = arc[0];
				old[1] = arc[1];
			}
			return true;

		} else if (old[2]*arc[1] >= arc[0]*old[3]) { /* old shadow ends after or within this arc */

			/* there is an overlap:
			 * 1) old shadow completely overlaps this one
			 * 2) old shadow will merge with this one
			 * 3) this one will merge two older shadows
			 */

			if (old[2]*arc[3] >= arc[2]*old[3]) { L("completely overlapped with previous shadow", old); return false; } /* case #1, completely overlapped */

			if (!blocks) { return true; }

			var next = SHADOWS[index];
			if (next && (next[0]*arc[3] <= arc[2]*next[1])) { /* case #3, merge two old shadows */
				L("merging", old, next);
				old[2] = next[2];
				old[3] = next[3];
				SHADOWS.splice(index, 1);
			} else { /* case #2, adjust old shadow */
				L("enlarging old", old);
				old[2] = arc[2];
				old[3] = arc[3];
			}
			return true;
		}

		index++;
	}
	
	/* this is a new shadow, add it to our list */
	if (blocks) { L("appending as a new shadow"); SHADOWS.push(arc); }
	return true;
}
