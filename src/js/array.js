Array.prototype.random = function() {
	if (!this.length) { return null; }
	return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.clone = function() {
	var arr = [];
	for (var i=0;i<this.length;i++) { arr.push(this[i]); }
	return arr;
}

Array.prototype.randomize = function() {
	var result = [];
	while (this.length) {
		var index = this.indexOf(this.random());
		result.push(this.splice(index, 1)[0]);
	}
	return result;
}
