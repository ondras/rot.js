# cellularTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "cellular", ->
  it "should export ROT.Map.Cellular", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Cellular"

  it "should be possible to create a Cellular object", ->
    maze = new ROT.Map.Cellular()
    maze.should.be.ok

  describe "Cellular", ->
    it "should extend ROT.Map", ->
      maze = new ROT.Map.Cellular()
      maze.should.be.an.instanceof ROT.Map
      maze.should.be.an.instanceof ROT.Map.Cellular
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        maze = new ROT.Map.Cellular()
        maze.create (x, y, value) ->
          almostDone()

      it "should create successive generations", (done) ->
        NUM_GENERATIONS = 10
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after NUM_GENERATIONS*DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        maze = new ROT.Map.Cellular()
        maze.randomize 0.5
        for i in [0...NUM_GENERATIONS]
          maze.create (x, y, value) ->
            almostDone()

      it "should be able to specify a fully-connected map", (done) ->
        NUM_GENERATIONS = 10
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after NUM_GENERATIONS*DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        maze = new ROT.Map.Cellular DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          born: [5, 6, 7, 8]
          survive: [4, 5, 6, 7, 8]
          topology: 8
          connected: true
        maze.randomize 0.5
        maze.set 0, 0, 1
        for i in [0...NUM_GENERATIONS]
          maze.create (x, y, value) ->
            almostDone()

      it "should be able to function without a callback", ->
        NUM_GENERATIONS = 4
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        maze = new ROT.Map.Cellular DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          born: [5, 6]
          survive: [4, 5, 6]
          topology: 6
          connected: true
        maze.randomize 0.5
        for i in [0...NUM_GENERATIONS]
          maze.create()

#----------------------------------------------------------------------------
# end of cellularTest.coffee
