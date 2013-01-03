var L = function() { 
	var args = [];
	for (var i=0;i<arguments.length;i++) {
		var a = arguments[i];
		args.push(a instanceof Array ? a.join(",") : a);
	}
	return console.log.apply(console, args); 
}

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
	
	var cx, cy, blocks, A1, A2;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		L("circle at r=", r);
		var neighbors = this._getCircle(x, y, r);
		var neighborCount = neighbors.length;

		for (var i=0;i<neighborCount;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			/* shift half-an-angle backwards to maintain consistency of 0-th cells */
			A1 = [i ? 2*i-1 : 2*neighborCount-1, 2*neighborCount];
			A2 = [2*i+1, 2*neighborCount]; 
			L("new arc", A1, A2);
			
			blocks = !this._lightPasses(cx, cy);
			if (this._visibleCoords(A1, A2, blocks, SHADOWS)) { callback(cx, cy, r); }

			L("current shadows:", SHADOWS);
			if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) { L("cutoff at", SHADOWS); return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
}

/**
 * @param {int[2]} A1 arc start
 * @param {int[2]} A2 arc end
 * @param {bool} blocks Does current cell block visibility?
 * @param {int[][]} SHADOWS list of active shadows
 */
ROT.FOV.PreciseShadowcasting.prototype._visibleCoords = function(A1, A2, blocks, SHADOWS) {
	L("checking arc", A1, A2, "whose blocking is", blocks);

	if (A1[0] > A2[0]) {
		L("zero encountered - splitting into two");
		var v1 = arguments.callee(A1, [A1[1], A1[1]], blocks, SHADOWS);
		var v2 = arguments.callee([0, 1], A2, blocks, SHADOWS);
		return (v1 || v2);
	}

	/* find indices of shadows which are >= our new arc */
	var index1 = -1, index2 = -1, index = 0;
	while (index < SHADOWS.length) {
		var old = SHADOWS[index];
		if (index1 == -1 && old[0]*A1[1] >= A1[0]*old[1]) { index1 = index; }
		if (index2 == -1 && old[0]*A2[1] > A2[0]*old[1]) { index2 = index; break; } /* important! we check GREATER (not greater-or-equal) for the second point! */
		index++;
	}

	L("index1", index1);
	L("index2", index2);
	if (index2 == -1) { index2 = SHADOWS.length; }
	if (index1 == -1) { index1 = SHADOWS.length; }

	if (index2 % 2) { /* we end WITHIN an existing shadow */
		var remove = index2-index1; /* we will remove this many shadows */
		if (!remove) { return false; } /* subset of an existing shadow */

		if (blocks) { /* adjust */
			if (remove % 2) { /* remove and insert */
				SHADOWS.splice(index1, remove, A1);
			} else { /* just remove */
				SHADOWS.splice(index1, remove);
			}
		}

		return true;

	} else { /* we end OUTSIDE of an existing shadow */

		if (blocks) { /* adjust */
			var remove = index2-index1;
			if (remove % 2) { /* remove and insert second */
				SHADOWS.splice(index1, remove, A2);
			} else { /* remove and insert both (append when remove=0) */
				SHADOWS.splice(index1, remove, A1, A2);
			}
		}

		/* check for special case when the new arc is a subset of an existing, sharing the second edge */
		

		return true;
	}
}
