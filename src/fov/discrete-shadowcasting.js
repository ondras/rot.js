/**
 * @class Discrete shadowcasting algorithm
 * @augments ROT.FOV
 */
ROT.FOV.DiscreteShadowcasting = function(lightPassesCallback) {
	ROT.FOV.call(this, lightPassesCallback);
}
ROT.FOV.DiscreteShadowcasting.extend(ROT.Map);

ROT.FOV.DiscreteShadowcasting.prototype.compute = function(x, y, R, callback) {
	var center = this._coords;
	var map = this._map;

	/* this place is always visible */
	callback(x, y, 0);

	/* standing in a dark place. FIXME is this a good idea?  */
	if (!this._lightPasses(x, y)) { return; }
	
	/* start and end angles */
	var DATA = [];
	
	var cellCount = 0;
	var A, B, cx, cy, blocks, diff;
	var diffs = [
		[ 0, -1],
		[-1,  0],
		[ 0,  1],
		[ 1,  0]
	];

	
	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		cellCount = 8*r;
		var angle = 360 / cellCount;

		cx = x+r;
		cy = y+r;

		for (var i=0;i<cellCount;i++) {
			A = angle * (i - 0.5);
			B = A + angle;
			
			blocks = !this._lightPasses(cx, cy);
			if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) { callback(cx, cy, r); }
			
			if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) { return; } /* cutoff? */
			
			diff = diffs[Math.floor(i*4/cellCount)];
			cx += diff[0];
			cy += diff[1];
		} /* for all cells in this ring */
	} /* for all rings */
}

/**
 * @param {int} A start angle
 * @param {int} B end angle
 * @param {bool} blocks Does current cell block visibility?
 * @param {int[][]} DATA shadowed angle pairs
 */
ROT.FOV.DiscreteShadowcasting.prototype._visibleCoords = function(A, B, blocks, DATA) {
	if (A < 0) { 
		var v1 = arguments.callee(0, B, blocks, DATA);
		var v2 = arguments.callee(360+A, 360, blocks, DATA);
		return v1 || v2;
	}
	
	var index = 0;
	while (index < DATA.length && DATA[index] < A) { index++; }
	
	if (index == DATA.length) { /* completely new shadow */
		if (blocks) { DATA.push(A, B); } 
		return true;
	}
	
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
