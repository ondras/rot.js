String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.substring(1);
}

String.prototype.format = function() {
	var args = Array.prototype.slice.call(arguments);
	var str = this;
	return str.replace(/%s/g, function(match, index) {
		if (str.charAt(index-1) == "%") {
			return match;
		} else {
			return args.shift();
		}
	});
}
