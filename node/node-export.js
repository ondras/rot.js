/**
 * @namespace Export to Node.js module
 */
if (typeof exports !== "undefined") {
	for (var p in ROT) {
		exports[p] = ROT[p];
	}
}
