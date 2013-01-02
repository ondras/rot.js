var L = function() { return console.log.apply(console, arguments); }

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
ROT.FOV.PreciseShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
}

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
	
	var cx, cy, blocks, shadow;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		L("circle at r=", r);
		var neighbors = this._getCircle(x, y, r);

		for (var i=0;i<neighbors.length;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			shadow = [i ? 2*i-1 : 2*neighbors.length-1, 2*neighbors, 2*i+1, 2*neighbors];
			L("new shadow", shadow);
			
			blocks = !this._lightPasses(cx, cy);
			if (this._visibleCoords(shadow, blocks, SHADOWS)) { callback(cx, cy, r); }
			
			if (SHADOWS.length == 1 && SHADOWS[0] == 0 && SHADOWS[2] == SHADOWS[3]) { L("cutoff at", SHADOWS); return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
}

/**
 * @param {int[4]} shadow
 * @param {bool} blocks Does current cell block visibility?
 * @param {int[][]} SHADOWS list of active shadows
 */
ROT.FOV.PreciseShadowcasting.prototype._visibleCoords = function(shadow, blocks, SHADOWS) {
	if (shadow[0] > shadow[2]) {
		L("zero encountered - splitting into two");
		var v1 = arguments.callee([shadow[0], shadow[1], 1, 1], blocks, SHADOWS);
		var v2 = arguments.callee([0, 1, shadow[2], shadow[3]], blocks, SHADOWS);
		return v1 || v2;
	}
	
	var old, index = 0;
	while (index < SHADOWS.length) {
		old = SHADOWS[index];
		
		/* is the old shadow AFTER this one? */

		if () { /* old starts after this one */
			return;
		} else if () { /* old ends after this one */
			return;
		}
		
		
	}
	
	/* this is a new shadow, add it to our list */
	if (blocks) { SHADOWS.push(shadow); }
	return true;
	
	var count = 0;
	
	if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
		while (index < DATA.length && DATA[index] < B) {
			index++;
			count++;
		}
		
		if (count == 0) { return false; }
		
		if (blocks) { 
			if (count % 2) {
				DATA.splice(index-count, count, B);
			} else {
				DATA.splice(index-count, count);
			}
		}
		
		return true;

	} else { /* this shadow starts outside an existing shadow, or within a starting boundary */
		while (index < DATA.length && DATA[index] < B) {
			index++;
			count++;
		}
		
		/* visible when outside an existing shadow, or when overlapping */
		if (A == DATA[index-count] && count == 1) { return false; }
		
		if (blocks) { 
			if (count % 2) {
				DATA.splice(index-count, count, A);
			} else {
				DATA.splice(index-count, count, A, B);
			}
		}
			
		return true;
	}
}
