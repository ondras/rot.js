describe("Util", function() {
	describe("String", function() {
		describe("capitalize", function() {
			it("should capitalize first letter", function() {
				expect(ROT.Util.capitalize("abc")).toBe("Abc");
				expect(ROT.Util.capitalize("Abc")).toBe("Abc");
			});
		});
		describe("format", function() {
			it("should not replace when not requested", function() {
				expect(ROT.Util.format("aaa bbb ccc")).toBe("aaa bbb ccc");
			});

			it("should ignore double-percents", function() {
				expect(ROT.Util.format("%%s")).toBe("%s");
			});

			it("should replace %s by default", function() {
				expect(ROT.Util.format("a %s c", "b")).toBe("a b c");
			});

			it("should replace multiple arguments", function() {
				expect(ROT.Util.format("a %s,%s,x", "b", "c")).toBe("a b,c,x");
			});

			it("should ignore remaining arguments", function() {
				expect(ROT.Util.format("a %s c", "b", "c")).toBe("a b c");
			});

			it("should skip missing arguments", function() {
				expect(ROT.Util.format("a %s %s", "b")).toBe("a b %s");
			});

			it("should use braces", function() {
				expect(ROT.Util.format("%{s}ss", "b")).toBe("bss");
				expect(ROT.Util.format("%s}ss", "b")).toBe("b}ss");
				expect(ROT.Util.format("%{s ss", "b")).toBe("%{s ss");
			});

			it("should capitalize when requested", function() {
				expect(ROT.Util.format("a %S", "b")).toBe("a B");
			});

			it("should perform custom mapping", function() {
				var oldMap = ROT.Util.format.map;
				ROT.Util.format.map = {
					s: "test1",
					xxx: "test2"
				}
				var obj = {
					test1:function() { return "foo"; },
					test2:function() { return "bar"; },
				}
				expect(ROT.Util.format("%s %S %x %xxx %Xxx %XXX", obj, obj, obj, obj, obj)).toBe("foo Foo %x bar Bar Bar");
				ROT.Util.format.map = oldMap;
			});

			it("should pass params", function() {
				var oldMap = ROT.Util.format.map;
				ROT.Util.format.map = { foo: "foo" };
				var obj = {
					foo:function($) { return $+$; }
				}
				expect(ROT.Util.format("%{foo,bar}", obj)).toBe("barbar");
				ROT.Util.format.map = oldMap;
			});
			it("should replace formatting strings", function() {
				expect(ROT.Util.format("%s %s", 1, 2, 3)).toBe("1 2");
			});
			it("should ignore double-percents", function() {
				expect(ROT.Util.format("%%s", 1, 2, 3)).toBe("%s");
			});
		});
	});
	describe("Number", function() {
		describe("mod", function() {
			it("should compute modulus of a positive number", function() {
				expect(ROT.Util.mod(7, 3)).toBe(1);
			});
			it("should compute modulus of a negative number", function() {
				expect(ROT.Util.mod(-7, 3)).toBe(2);
			});
		});
	});
});
