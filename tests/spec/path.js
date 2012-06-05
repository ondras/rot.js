describe("Path", function() {
	/**
	 * ........
	 * A###.###
	 * ..B#.#X#
	 * .###.###
	 * ....Z...
	 */
	var MAP48 = [ /* transposed */
		[0, 0, 0, 0, 0],	
		[0, 1, 0, 1, 0],	
		[0, 1, 0, 1, 0],	
		[0, 1, 1, 1, 0],	
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 1, 0, 1, 0],
		[0, 1, 1, 1, 0]
	];
	
	var A = [0, 1];
	var B = [2, 2];
	var Z = [4, 4];
	var X = [6, 2];
	var PATH = [];
	
	var PASSABLE_CALLBACK_48 = function(x, y) {
		if (x<0 || y<0 || x>=MAP48.length || y>=MAP48[0].length) { return false; }
		return (MAP48[x][y] == 0);
	}
	
	var PATH_CALLBACK = function(x, y) { PATH.push(x, y); }
	
	beforeEach(function() {
		PATH = [];
	});
	
	
	describe("Dijkstra", function() {
		describe("8-topology", function() {
			var PATH_A = [0, 1, 0, 2, 0, 3, 1, 4, 2, 4, 3, 4, 4, 4];
			var PATH_B = [2, 2, 1, 2, 0, 3, 1, 4, 2, 4, 3, 4, 4, 4];
			var dijkstra = new ROT.Path.Dijkstra(Z[0], Z[1], PASSABLE_CALLBACK_48, {topology:8});
			
			it("should compute correct path A", function() {
				path = [];
				dijkstra.compute(A[0], A[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_A.toString());
			});

			it("should compute correct path B", function() {
				dijkstra.compute(B[0], B[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_B.toString());
			});

			it("should survive non-existant path X", function() {
				dijkstra.compute(X[0], X[1], PATH_CALLBACK);
				expect(PATH.length).toEqual(0);
			});
		}); /* 8-topology */

		describe("4-topology", function() {
			var PATH_A = [0, 1, 0, 2, 0, 3, 0, 4, 1, 4, 2, 4, 3, 4, 4, 4];
			var PATH_B = [2, 2, 1, 2, 0, 2, 0, 3, 0, 4, 1, 4, 2, 4, 3, 4, 4, 4];
			var dijkstra = new ROT.Path.Dijkstra(Z[0], Z[1], PASSABLE_CALLBACK_48, {topology:4});
			
			it("should compute correct path A", function() {
				dijkstra.compute(A[0], A[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_A.toString());
			});

			it("should compute correct path B", function() {
				dijkstra.compute(B[0], B[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_B.toString());
			});

			it("should survive non-existant path X", function() {
				dijkstra.compute(X[0], X[1], PATH_CALLBACK);
				expect(PATH.length).toEqual(0);
			});
		}); /* 4-topology */

	}); /* dijkstra */

	describe("A*", function() {
		describe("8-topology", function() {
			var PATH_A = [0, 1, 0, 2, 0, 3, 1, 4, 2, 4, 3, 4, 4, 4];
			var PATH_B = [2, 2, 1, 2, 0, 3, 1, 4, 2, 4, 3, 4, 4, 4];
			var dijkstra = new ROT.Path.AStar(Z[0], Z[1], PASSABLE_CALLBACK_48, {topology:8});
			
			it("should compute correct path A", function() {
				path = [];
				dijkstra.compute(A[0], A[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_A.toString());
			});

			it("should compute correct path B", function() {
				dijkstra.compute(B[0], B[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_B.toString());
			});

			it("should survive non-existant path X", function() {
				dijkstra.compute(X[0], X[1], PATH_CALLBACK);
				expect(PATH.length).toEqual(0);
			});
		}); /* 8-topology */

		describe("4-topology", function() {
			var PATH_A = [0, 1, 0, 2, 0, 3, 0, 4, 1, 4, 2, 4, 3, 4, 4, 4];
			var PATH_B = [2, 2, 1, 2, 0, 2, 0, 3, 0, 4, 1, 4, 2, 4, 3, 4, 4, 4];
			var dijkstra = new ROT.Path.AStar(Z[0], Z[1], PASSABLE_CALLBACK_48, {topology:4});
			
			it("should compute correct path A", function() {
				dijkstra.compute(A[0], A[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_A.toString());
			});

			it("should compute correct path B", function() {
				dijkstra.compute(B[0], B[1], PATH_CALLBACK);
				expect(PATH.toString()).toEqual(PATH_B.toString());
			});

			it("should survive non-existant path X", function() {
				dijkstra.compute(X[0], X[1], PATH_CALLBACK);
				expect(PATH.length).toEqual(0);
			});
		}); /* 4-topology */

	}); /* dijkstra */

}); /* path */
