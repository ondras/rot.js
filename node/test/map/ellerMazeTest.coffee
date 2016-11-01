# ellerMazeTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "ellermaze", ->
  it "should export ROT.Map.EllerMaze", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "EllerMaze"

  it "should be possible to create a EllerMaze object", ->
    maze = new ROT.Map.EllerMaze()
    maze.should.be.ok

  describe "EllerMaze", ->
    it "should extend ROT.Map", ->
      maze = new ROT.Map.EllerMaze()
      maze.should.be.an.instanceof ROT.Map
      maze.should.be.an.instanceof ROT.Map.EllerMaze
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        maze = new ROT.Map.EllerMaze DEFAULT_WIDTH, DEFAULT_HEIGHT
        maze.create (x, y, value) ->
          almostDone()

#----------------------------------------------------------------------------
# end of ellerMazeTest.coffee
