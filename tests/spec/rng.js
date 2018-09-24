describe("RNG", function() {
	describe("getUniform", function() {
		var value = ROT.RNG.getUniform();
		it("should return a number", function() {
			expect(typeof(value)).toEqual("number");
		});
		it("should return a number 0..1", function() {
			expect(value).toBeGreaterThan(0);
			expect(value).toBeLessThan(1);
		});
	});

	describe("getUniformInt", function() {
	var lowerBound = 5;
	var upperBound = 10;
		it("should return a number", function() {
		  var value = ROT.RNG.getUniformInt(lowerBound, upperBound);
			expect(typeof(value)).toEqual("number");
		});
		it("should not care which number is larger in the arguments", function() {
			var seed = Math.round(Math.random()*1000000);
			ROT.RNG.setSeed(seed);
			var val1 = ROT.RNG.getUniformInt(lowerBound, upperBound);
			ROT.RNG.setSeed(seed);
			var val2 = ROT.RNG.getUniformInt(upperBound, lowerBound);
			expect(val1).toEqual(val2);
		});
		it("should only return a number in the desired range", function() {
			var value = ROT.RNG.getUniformInt(lowerBound, upperBound);
			var value2 = ROT.RNG.getUniformInt(upperBound, lowerBound);
			expect(value).not.toBeGreaterThan(upperBound);
			expect(value).not.toBeLessThan(lowerBound);
			expect(value2).not.toBeGreaterThan(upperBound);
			expect(value2).not.toBeLessThan(lowerBound);
		});
	});

	describe("seeding", function() {
		it("should return a seed number", function() {
			expect(typeof(ROT.RNG.getSeed())).toEqual("number");
		});

		it("should return the same value for a given seed", function() {
			var seed = Math.round(Math.random()*1000000);
			ROT.RNG.setSeed(seed);
			var val1 = ROT.RNG.getUniform();
			ROT.RNG.setSeed(seed);
			var val2 = ROT.RNG.getUniform();
			expect(val1).toEqual(val2);
		});

		it("should return a precomputed value for a given seed", function() {
			ROT.RNG.setSeed(12345);
			var val = ROT.RNG.getUniform();
			expect(val).toEqual(0.01198604702949524);
		});
	});
	
	describe("state manipulation", function() {
		it("should return identical values after setting identical states", function() {
			ROT.RNG.getUniform();
			
			var state = ROT.RNG.getState();
			var val1 = ROT.RNG.getUniform();
			ROT.RNG.setState(state);
			var val2 = ROT.RNG.getUniform();

			expect(val1).toEqual(val2);
		});
	});

	describe("cloning", function() {
		it("should be able to clone a RNG", function() {
			var clone = ROT.RNG.clone();
			expect(typeof(clone)).toEqual("object");
		});

		it("should clone a working RNG", function() {
			var clone = ROT.RNG.clone();
			var num = clone.getUniform();
			expect(typeof(num)).toEqual("number");
		});

		it("should clone maintaining its state", function() {
			var clone = ROT.RNG.clone();
			var num1 = ROT.RNG.getUniform();
			var num2 = clone.getUniform();
			expect(num1).toEqual(num2);
		});
	});

});
