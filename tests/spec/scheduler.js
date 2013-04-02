describe("Scheduler", function() {
	var A50 = {getSpeed: function() { return 50; }};
	var A100a = {getSpeed: function() { return 100; }};
	var A100b = {getSpeed: function() { return 100; }};
	var A200 = {getSpeed: function() { return 200; }};
	var s = new ROT.Scheduler.Speed();

	beforeEach(function() {
		s.clear();
		this.addMatchers({
			toSchedule: function(expected) {
				for (var i=0;i<Math.max(expected.length, this.actual.length);i++) {
					if (this.actual[i] !== expected[i]) { return false; }
				}
				return true;
			}
		});
	});

	it("should schedule same speed evenly", function() {
		s.addActor(A100a);
		s.addActor(A100b);
		var result = [];
		for (var i=0;i<4;i++) { result.push(s.next()); }

		expect(result).toSchedule([A100a, A100b, A100a, A100b]);
	});

	it("should schedule different speeds properly", function() {
		s.addActor(A50);
		s.addActor(A100a);
		s.addActor(A200);
		var result = [];
		for (var i=0;i<7;i++) { result.push(s.next()); }
		expect(result).toSchedule([A200, A100a, A200, A200, A50, A100a, A200]);
	});

});
