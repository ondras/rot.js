describe("Engine", function() {
	var RESULT = 0;
	var E = null;
	var S = null;
	var A50 = {getSpeed: function() { return 50; }, act: function() { RESULT++; } };
	var A70 = {getSpeed: function() { return 70; }, act: function() { RESULT++; S.add(A100); } };
	var A100 = {getSpeed: function() { return 100; }, act: function() { E.lock(); } };

	beforeEach(function() {
		RESULT = 0;
		S = new ROT.Scheduler.Speed();
		E = new ROT.Engine(S);
	});

	it("should stop when locked", function() {
		S.add(A50, true);
		S.add(A100, true);

		E.start();
		expect(RESULT).toEqual(0);
	});

	it("should run until locked", function() {
		S.add(A50, true);
		S.add(A70, true);

		E.start();
		expect(RESULT).toEqual(2);
	});

	it("should run only when unlocked", function() {
		S.add(A70, true);

		E.lock();
		E.start();
		expect(RESULT).toEqual(0);
		E.start();
		expect(RESULT).toEqual(1);
	});
});
