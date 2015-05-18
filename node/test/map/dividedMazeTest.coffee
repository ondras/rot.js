# dividedMazeTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "dividedmaze", ->
  it "should export ROT.Map.DividedMaze", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "DividedMaze"

  it "should be possible to create a DividedMaze object", ->
    maze = new ROT.Map.DividedMaze()
    maze.should.be.ok

  describe "DividedMaze", ->
    it "should extend ROT.Map", ->
      maze = new ROT.Map.DividedMaze()
      maze.should.be.an.instanceof ROT.Map
      maze.should.be.an.instanceof ROT.Map.DividedMaze
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        maze = new ROT.Map.DividedMaze()
        maze.create (x, y, value) ->
          almostDone()

#----------------------------------------------------------------------------
# end of dividedMazeTest.coffee
