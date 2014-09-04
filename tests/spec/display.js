describe("Display", function() {
	describe("eventToPosition", function() {
		var appendToBody = function(display) {
			var c = display.getContainer();
			c.style.position = "absolute";
			c.style.left = "100px";
			c.style.top = "100px";
			c.style.visibility = "hidden";
			document.body.appendChild(c);
			document.body.scrollLeft = 0;
			document.body.scrollTop = 0;
			document.documentElement.scrollLeft = 0;
			document.documentElement.scrollTop = 0;
		}
		
		var unlink = function(display) {
			var c = display.getContainer();
			c.parentNode.removeChild(c);
		}
		
		describe("rectangular layout", function() {
			it("should compute inside canvas", function() {
				var d = new ROT.Display({width:10, height:10});
				appendToBody(d);
				var node = d.getContainer();
				var cellW = node.offsetWidth/10;
				var cellH = node.offsetHeight/10;
				var e = {clientX: 100 + 1.5*cellW, clientY: 100 + 2.5*cellH};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(1);
				expect(pos[1]).toBe(2);				
				unlink(d);
			});
			it("should work with touch events as well", function() {
				var d = new ROT.Display({width:10, height:10});
				appendToBody(d);
				var node = d.getContainer();
				var cellW = node.offsetWidth/10;
				var cellH = node.offsetHeight/10;
				var touch1 = {clientX: 100 + 1.5*cellW, clientY: 100 + 2.5*cellH};
				var touch2 = {clientX: 0, clientY: 0};
				var e = {touches:[touch1, touch2]};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(1);
				expect(pos[1]).toBe(2);				
				unlink(d);
			});
			it("should fail outside of canvas (left top)", function() {
				var d = new ROT.Display({width:10, height:10});
				appendToBody(d);
				var e = {clientX: 10, clientY: 10};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(-1);
				expect(pos[1]).toBe(-1);				
				unlink(d);
			});
			it("should fail outside of canvas (right bottom)", function() {
				var d = new ROT.Display({width:10, height:10});
				appendToBody(d);
				var e = {clientX: 1000, clientY: 1000};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(-1);
				expect(pos[1]).toBe(-1);				
				unlink(d);
			});
		});

		describe("hex layout", function() {
			it("should compute inside canvas - odd row", function() {
				var d = new ROT.Display({width:10, height:10, layout:"hex"});
				appendToBody(d);
				var node = d.getContainer();
				var cellH = node.offsetHeight/10;
				var cellW = node.offsetWidth/5.5;
				var e = {clientX: 100 + 1.5*cellW, clientY: 100 + 2.5*cellH};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(2);
				expect(pos[1]).toBe(2);
				unlink(d);
			});
			it("should compute inside canvas - even row", function() {
				var d = new ROT.Display({width:10, height:10, layout:"hex"});
				appendToBody(d);
				var node = d.getContainer();
				var cellH = node.offsetHeight/10;
				var cellW = node.offsetWidth/5.5;
				var e = {clientX: 100 + 2*cellW, clientY: 100 + 1.5*cellH};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(3);
				expect(pos[1]).toBe(1);
				unlink(d);
			});
		});

		describe("hex layout (transposed)", function() {
			it("should compute inside canvas - odd column", function() {
				var d = new ROT.Display({width:10, height:10, layout:"hex", transpose:true});
				appendToBody(d);
				var node = d.getContainer();
				var cellH = node.offsetHeight/5.5;
				var cellW = node.offsetWidth/10;
				var e = {clientX: 100 + 2.5*cellW, clientY: 100 + 1.5*cellH};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(2);
				expect(pos[1]).toBe(2);
				unlink(d);
			});
			it("should compute inside canvas - even column", function() {
				var d = new ROT.Display({width:10, height:10, layout:"hex", transpose:true});
				appendToBody(d);
				var node = d.getContainer();
				var cellH = node.offsetHeight/5.5;
				var cellW = node.offsetWidth/10;
				var e = {clientX: 100 + 1.5*cellW, clientY: 100 + 2*cellH};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(3);
				expect(pos[1]).toBe(1);
				unlink(d);
			});
		});
		describe("tile layout", function() {
			it("should compute inside canvas", function() {
				var d = new ROT.Display({width:64, height:64, layout:"tile", tileWidth:32, tileHeight:32});
				appendToBody(d);
				var node = d.getContainer();
				var e = {clientX: 100+10, clientY: 100+40};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(0);
				expect(pos[1]).toBe(1);				
				unlink(d);
			});
			it("should fail outside of canvas (left top)", function() {
				var d = new ROT.Display({width:64, height:64, layout:"tile", tileWidth:32, tileHeight:32});
				appendToBody(d);
				var e = {clientX: 10, clientY: 10};
				var pos = d.eventToPosition(e);
				expect(pos[0]).toBe(-1);
				expect(pos[1]).toBe(-1);				
				unlink(d);
			});
		});

	});

	describe("drawText", function() {
		it("should provide default maxWidth", function() {
			var d = new ROT.Display({width:10, height:10});
			var lines = d.drawText(7, 0, "aaaaaa");
			expect(lines).toBe(2);
		});
	});

	describe("computeSize", function() {
		describe("rectangular layout", function() {
			var d1 = new ROT.Display({fontSize:18, spacing:1});
			var d2 = new ROT.Display({fontSize:18, spacing:1.2});

			it("should compute integer size for spacing 1", function() {
				var size = d1.computeSize(1/0, 180);
				expect(size[1]).toBe(10);
			});

			it("should compute fractional size for spacing 1", function() {
				var size = d1.computeSize(1/0, 170);
				expect(size[1]).toBe(9);
			});

			it("should compute integer size for spacing >1", function() {
				var size = d2.computeSize(1/0, 220);
				expect(size[1]).toBe(10);
			});

			it("should compute fractional size for spacing >1", function() {
				var size = d2.computeSize(1/0, 210);
				expect(size[1]).toBe(9);
			});
		});

		describe("hex layout", function() {
			var d1 = new ROT.Display({fontSize:18, spacing:1, layout:"hex"});
			var d2 = new ROT.Display({fontSize:18, spacing:1.2, layout:"hex"});

			it("should compute size for spacing 1", function() {
				var size = d1.computeSize(1/0, 96);
				expect(size[1]).toBe(5);
			});

			it("should compute size for spacing >1", function() {
				var size = d2.computeSize(1/0, 96);
				expect(size[1]).toBe(4);
			});
		});

		describe("tile layout", function() {
			var d = new ROT.Display({layout:"tile", tileWidth:32, tileHeight:16});

			it("should compute proper size", function() {
				var size = d.computeSize(200, 300);
				expect(size[0]).toBe(6);
				expect(size[1]).toBe(18);
			});
		});
	});

	describe("computeFontSize", function() {
		describe("rectangular layout", function() {
			var d1 = new ROT.Display({width:100, height:20, spacing:1});
			var d2 = new ROT.Display({width:100, height:20, spacing:1.2});

			it("should compute integer size for spacing 1", function() {
				var size = d1.computeFontSize(1/0, 180);
				expect(size).toBe(9);
			});

			it("should compute fractional size for spacing 1", function() {
				var size = d1.computeFontSize(1/0, 170);
				expect(size).toBe(8);
			});

			it("should compute integer size for spacing >1", function() {
				var size = d2.computeFontSize(1/0, 180);
				expect(size).toBe(7);
			});

			it("should compute fractional size for spacing >1", function() {
				var size = d2.computeFontSize(1/0, 170);
				expect(size).toBe(6);
			});
		});

		describe("hex layout", function() {
			var d1 = new ROT.Display({width:100, height:5, spacing:1, layout:"hex"});
			var d2 = new ROT.Display({width:100, height:5, spacing:1.3, layout:"hex"});
			window.d1 = d1;

			it("should compute size for spacing 1", function() {
				var size = d1.computeFontSize(1/0, 96);
				expect(size).toBe(19);
			});

			it("should compute size for spacing >1", function() {
				var size = d2.computeFontSize(1/0, 96);
				expect(size).toBe(14);
			});
		});

		describe("tile layout", function() {
			var d = new ROT.Display({layout:"tile", width:6, height:18});

			it("should compute proper size", function() {
				var size = d.computeFontSize(200, 300);
				expect(size[0]).toBe(33);
				expect(size[1]).toBe(16);
			});
		});
	});
});
