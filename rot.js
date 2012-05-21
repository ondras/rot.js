var ROT = {};
ROT.Math = {};
ROT.Math.RandomGenerator = function(seed) {
	this.seed = seed || 0xEFC8249D;
	this.frac = 2.3283064365386963e-10; // 2^-32
	
	seed = this.seed;
	this.s0 = (seed >>> 0) * this.frac;
	seed = (seed * 1103515245) + 12345;
	this.s1 = (seed >>> 0) * this.frac;
	seed = (seed * 1103515245) + 12345;
	this.s2 = (seed >>> 0) * this.frac;
	this.c = 1;
};

Generator.prototype.generate = function() {
	var t = 2091639 * this.s0 + this.c * this.frac;
	this.s0 = this.s1;
	this.s1 = this.s2;
	this.c = t | 0;
	this.s2 = t - this.c;
	return this.s2;
};
  
exports.Generator = Generator;
