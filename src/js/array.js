/**
 * @returns {any} Randomly picked item, null when length=0
 */
Array.prototype.random = function() {
	if (!this.length) { return null; }
	return this[Math.floor(ROT.RNG.getUniform() * this.length)];
}

/**
 * @returns {array} Shallow copy
 */
Array.prototype.clone = function() {
	var arr = [];
	for (var i=0;i<this.length;i++) { arr.push(this[i]); }
	return arr;
}

/**
 * @returns {array} New array with randomized items
 * FIXME destroys this!
 */
Array.prototype.randomize = function() {
	var result = [];
	while (this.length) {
		var index = this.indexOf(this.random());
		result.push(this.splice(index, 1)[0]);
	}
	return result;
}

/**
 * Modifies array values so they fit within a range
 * @param {number} min
 * @param {number} max
 */
Array.prototype.clamp = function(min, max) {
	for (var i=0;i<this.length;i++) {
		var val = this[i];
		if (val < min) {
			this[i] = min;
		} else if (val > max) {
			this[i] = max;
		}
	}
	return this;
}
