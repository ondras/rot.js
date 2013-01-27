describe("Display", function() {
	describe("drawText", function() {
		it("should provide default maxWidth", function() {
			var d = new ROT.Display({width:10, height:10});
			var lines = d.drawText(7, 0, "aaaaaa");
			expect(lines).toBe(2);
		});
	});
});
