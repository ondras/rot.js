ROT.RNG = {
	/**
	 * @returns {number} 
	 */
	getSeed: function() {
		return this._seed;
	},

	/**
	 * @param {number} seed Seed the number generator
	 */
	setSeed: function(seed) {
		seed = (seed < 1 ? 1/seed : seed);

		this._seed = seed;
		this._s0 = (seed >>> 0) * this._frac;
		seed = (seed * 1103515245) + 12345;
		this._s1 = (seed >>> 0) * this._frac;
		seed = (seed * 1103515245) + 12345;
		this._s2 = (seed >>> 0) * this._frac;
		this.c = 1;

		return this;
	},

	/**
	 * @returns {float} Pseudorandom value (0,1) exclusive, uniformly distributed
	 */
	getUniform: function() {
		var t = 2091639 * this._s0 + this._c * this._frac;
		this._s0 = this._s1;
		this._s1 = this._s2;
		this._c = t | 0;
		this._s2 = t - this._c;
		return this._s2;
	},

	/**
	 * @param {float} mean Mean value
	 * @param {float} stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
	 * @returns {float} A normally distributed pseudorandom value
	 */
	getNormal: function(mean, stddev) {
		do {
			var u = 2*this.getUniform()-1;
			var v = 2*this.getUniform()-1;
			var r = u*u + v*v;
		} while (r > 1 || r == 0);

		var gauss = u * Math.sqrt(-2*Math.log(r)/r);
		return mean + gauss*stddev;
	},

	/**
	 * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
	 */
	getPercentage: function() {
		return Math.ceil(this.getUniform()*100);
	},
	
	pushState: function() {
		this._state.push(this.getState());
		return this;
	},
	
	popState: function() {
		this.setState(this._state.pop());
		return this;
	},
	
	getState: function() {
		return [this._s0, this._s1, this._s2, this._c];
	},

	setState: function(state) {
		this._s0 = state[0];
		this._s1 = state[1];
		this._s2 = state[2];
		this._c  = state[3];
		return this;
	},

	_s0: 0,
	_s1: 0,
	_s2: 0,
	_c: 0,
	_frac: 2.3283064365386963e-10, // 2^-32
	_state: []
}

ROT.RNG.setSeed(Date.now());
