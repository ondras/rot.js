/**
 * @returns {any} Randomly picked item, null when length=0
 */
/*
ROT.random = function(arr) {
	if (!arr.length) { return null; }
	return arr[Math.floor(ROT.getUniform() * arr.length)];
}
*/

/**
 * @returns {array} New array with randomized items
 * FIXME destroys this!
 */

/*
ROT.randomize = function(arr) {
	var result = [];
	while (arr.length) {
		var index = arr.indexOf(ROT.random(arr));
		result.push(arr.splice(index, 1)[0]);
	}
	return result;
}
*/

