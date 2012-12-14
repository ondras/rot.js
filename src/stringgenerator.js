/**
 * @class (Markov process)-based string generator. 
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>. 
 * Offers configurable order and prior.
 * @param {int} [order=3]
 * @param {float} [prior=0.001]
 */
ROT.StringGenerator = function(order, prior) {
	this._order = (order || 3);
	this._prior = (typeof(prior) == "number" ? prior : 0.001);
	this._boundary = String.fromCharCode(0);
	this._prefix = new Array(this._order+1).join(this._boundary);
	this._suffix = this._boundary;

	/* prior values */
	this._letters = {};
	this._letters[this._boundary] = this._prior;

	this._data = {};
}

/**
 * Remove all learning data
 */
ROT.StringGenerator.prototype.clear = function() {
	this._data = {};
	this._letters = {};
}

/**
 * @returns {string} Generated string
 */
ROT.StringGenerator.prototype.generate = function() {
	var result = this._sample(this._prefix);
	while (result.charAt(result.length-1) != this._boundary) {
		result += this._sample(result);
	}
	return result.substring(0, result.length-1);
}

/**
 * Observe (learn) a string from a training set
 */
ROT.StringGenerator.prototype.observe = function(string) {
	for (var i=0; i<string.length; i++) {
		this._letters[string.charAt(i)] = this._prior;
	}

	string = this._prefix + string + this._suffix; /* add boundary symbols */

	for (var i=this._order; i<string.length; i++) {
		var context = string.substring(i-this._order, i);
		var event = string.charAt(i);
		for (var j=0; j<context.length; j++) {
			var subcontext = context.substring(j);
			this._observeEvent(subcontext, event);
		}
	}
}

ROT.StringGenerator.prototype._observeEvent = function(context, event) {
	if (!(context in this._data)) { this._data[context] = {}; }
	var data = this._data[context];

	if (!(event in data)) { data[event] = 0; }
	data[event]++;
}

ROT.StringGenerator.prototype._sample = function(context) {
	context = this._backoff(context);
	var data = this._data[context];

	var available = {};
	for (var event in this._letters) { available[event] = this._letters[event]; }
	for (var event in data) { available[event] += data[event]; }

	return this._pickRandom(available);
}

ROT.StringGenerator.prototype._backoff = function(context) {
	if (context.length > this._order) {
		context = context.substring(context.length-this._order);
	} else if (context.length < this._order) {
		context = this._prefix.substring(0, this._order - context.length) + context;
	}

	while (!(context in this._data) && context.length > 0) { context = context.substring(1); }

	return context;
}


ROT.StringGenerator.prototype._pickRandom = function(data) {
	var total = 0;
	
	for (var id in data) {
		total += data[id];
	}
	var random = ROT.RNG.getUniform()*total;
	
	var part = 0;
	for (var id in data) {
		part += data[id];
		if (random < part) { return id; }
	}
}
