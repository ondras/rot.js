# iceyMazeTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "iceymaze", ->
  it "should export ROT.Map.IceyMaze", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "IceyMaze"

  it "should be possible to create a IceyMaze object", ->
    maze = new ROT.Map.IceyMaze()
    maze.should.be.ok

  describe "IceyMaze", ->
    it "should extend ROT.Map", ->
      maze = new ROT.Map.IceyMaze()
      maze.should.be.an.instanceof ROT.Map
      maze.should.be.an.instanceof ROT.Map.IceyMaze
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        almostDone = _.after 11*22, done
        maze = new ROT.Map.IceyMaze 11, 22
        maze.create (x, y, value) ->
          almostDone()

      it "should create an even sized maze", (done) ->
        almostDone = _.after 22*11, done
        maze = new ROT.Map.IceyMaze 22, 11
        maze.create (x, y, value) ->
          almostDone()

      it "should allow regularity to be specified", (done) ->
        almostDone = _.after 22*11, done
        maze = new ROT.Map.IceyMaze 22, 11, 5
        maze.create (x, y, value) ->
          almostDone()

#----------------------------------------------------------------------------
# end of iceyMazeTest.coffee
