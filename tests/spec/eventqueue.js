describe("EventQueue", function() {
	it("should return added event", function() {
		var q = new ROT.EventQueue();
		q.add("a", 100);
		expect(q.get()).toEqual("a");
	});

	it("should return null when no events are available", function() {
		var q = new ROT.EventQueue();
		expect(q.get()).toEqual(null);
	});

	it("should remove returned events", function() {
		var q = new ROT.EventQueue();
		q.add(0, 0);
		q.get();
		expect(q.get()).toEqual(null);
	});

	it("should remove events", function() {
		var q = new ROT.EventQueue();
		q.add(123, 0);
		q.add(456, 0);
		q.remove(123);
		expect(q.get()).toEqual(456);
	});

	it("should return events sorted", function() {
		var q = new ROT.EventQueue();
		q.add(456, 10);
		q.add(123, 5);
		q.add(789, 15);
		expect(q.get()).toEqual(123);
		expect(q.get()).toEqual(456);
		expect(q.get()).toEqual(789);
	});

	it("should compute elapsed time", function() {
		var q = new ROT.EventQueue();
		q.add(456, 10);
		q.add(123, 5);
		q.add(789, 15);
		q.get();
		q.get();
		q.get();
		expect(q.getTime()).toEqual(15);
	});

	it("should maintain event order for same timestamps", function() {
		var q = new ROT.EventQueue();
		q.add(456, 10);
		q.add(123, 10);
		q.add(789, 10);
		expect(q.get()).toEqual(456);
		expect(q.get()).toEqual(123);
		expect(q.get()).toEqual(789);
		expect(q.getTime()).toEqual(10);
	});
});
