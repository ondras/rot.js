# pathTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../../lib/rot"

describe "path", ->
  it "should export ROT.Path", ->
    ROT.should.have.property "Path"

  it "should be possible to create a Path object", ->
    path = new ROT.Path()
    path.should.be.ok
    
  describe "Path", ->
    describe "Path", ->
      it "should be possible to create a Path object with options", ->
        toX = 0
        toY = 0
        passableCallback = (x,y) -> true
        options =
          topology: 6
        path = new ROT.Path toX, toY, passableCallback, options
        path.should.be.ok

    describe "compute", ->
      it "should not do anything", ->
        toX = 0
        toY = 0
        passableCallback = (x,y) -> true
        options =
          topology: 6
        path = new ROT.Path toX, toY, passableCallback, options
        result = path.compute()
        should(result).equal undefined

    describe "_getNeighbors", ->
      it "should provide topology neighbors when passable", ->
        TOPOLOGY = 6
        toX = 0
        toY = 0
        passableCallback = (x,y) -> true
        options =
          topology: TOPOLOGY
        path = new ROT.Path toX, toY, passableCallback, options
        neighbors = path._getNeighbors()
        neighbors.length.should.equal TOPOLOGY

      it "should provide zero neighbors when not passable", ->
        TOPOLOGY = 6
        toX = 0
        toY = 0
        passableCallback = (x,y) -> false
        options =
          topology: TOPOLOGY
        path = new ROT.Path toX, toY, passableCallback, options
        neighbors = path._getNeighbors()
        neighbors.length.should.equal 0

#----------------------------------------------------------------------------
# end of pathTest.coffee
