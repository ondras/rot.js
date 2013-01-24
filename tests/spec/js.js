describe("JS", function() {
	describe("Array", function() {
		describe("clone", function() {
			it("should clone an array", function() {
				expect([1, 2, 3].clone()).toEqual([1, 2, 3]);
			});
			it("should return a new array", function() {
				expect([1, 2, 3].clone()).not.toBe([1, 2, 3]);
			});
		});
	});

	describe("String", function() {
		describe("capitalize", function() {
			it("should capitalize first letter", function() {
				expect("abc".capitalize()).toBe("Abc");
				expect("Abc".capitalize()).toBe("Abc");
			});
		});
		describe("format", function() {
			it("should replace formatting strings", function() {
				expect("%s %s".format(1, 2, 3)).toBe("1 2");
			});
			it("should ignore double-percents", function() {
				expect("%%s".format(1, 2, 3)).toBe("%%s");
			});
		});
		describe("lpad", function() {
			it("should lpad with defaults", function() {
				expect("a".lpad()).toBe("0a");
			});
			it("should lpad with char", function() {
				expect("a".lpad("b")).toBe("ba");
			});
			it("should lpad with count", function() {
				expect("a".lpad("b", 3)).toBe("bba");
			});
			it("should not lpad when not necessary", function() {
				expect("aaa".lpad("b", 3)).toBe("aaa");
			});
		});
		describe("rpad", function() {
			it("should rpad with defaults", function() {
				expect("a".rpad()).toBe("a0");
			});
			it("should rpad with char", function() {
				expect("a".rpad("b")).toBe("ab");
			});
			it("should rpad with count", function() {
				expect("a".rpad("b", 3)).toBe("abb");
			});
			it("should not rpad when not necessary", function() {
				expect("aaa".rpad("b", 3)).toBe("aaa");
			});
		});
	});

	describe("Date", function() {
		describe("now", function() {
			it("should return current timestamp", function() {
				expect(typeof(Date.now())).toBe("number");
				expect(Date.now()).toBeGreaterThan(0);
			});
		});
	});

	describe("Number", function() {
		describe("mod", function() {
			it("should compute modulus of a positive number", function() {
				expect((7).mod(3)).toBe(1);
			});
			it("should compute modulus of a negative number", function() {
				expect((-7).mod(3)).toBe(2);
			});
		});
	});

	describe("Function", function() {
		describe("create", function() {
			it("should create a proper child-parent binding", function() {
				var Parent = function() {};
				Parent.prototype.a = 3;
				var Child = function() {};
				Child.extend(Parent);
				var child = new Child();
				expect(child.a).toBe(3);
				expect(child.constructor).toBe(Child);
			});
		});
	});

	describe("Object", function() {
		describe("create", function() {
			it("should create a proper prototype chain", function() {
				var parent = {a:3};
				var child = Object.create(parent);
				expect(child.a).toBe(3);
				expect(child).not.toBe(parent);
			});
		});
	});
});
