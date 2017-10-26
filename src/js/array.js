/**
 * @returns {any} Randomly picked item, null when length=0
 */
var getRandomItem = function(arr) {
	if (!arr.length) { return null; }
	return arr[Math.floor(ROT.RNG.getUniform() * arr.length)];
};

/**
 * @returns {array} New array with randomized items
 */
var getRandomizedArray = function(arr) {
  var result = [];
  var clone = arr.slice();
  while (clone.length) {
    var index = clone.indexOf(getRandomItem(clone));
    result.push(clone.splice(index, 1)[0]);
  }
  return result;
};
