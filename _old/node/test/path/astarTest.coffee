# astarTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "astar", ->
  it "should export ROT.Path.AStar", ->
    ROT.should.have.property "Path"
    ROT.Path.should.have.property "AStar"

  it "should be possible to create a AStar object", ->
    astar = new ROT.Path.AStar()
    astar.should.be.ok

  describe "AStar", ->
    it "should extend ROT.Path", ->
      astar = new ROT.Path.AStar()
      astar.should.be.an.instanceof ROT.Path
      astar.should.be.an.instanceof ROT.Path.AStar

    describe "compute", ->
      it "should attempt to compute a path", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 8
        astar = new ROT.Path.AStar toX, toY, passableCallback, options
        astar.compute 0, 0, (x,y) ->

      it "should reuse a path it already has", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 8
        astar = new ROT.Path.AStar toX, toY, passableCallback, options
        astar.compute 0, 0, (x,y) ->
        astar.compute 0, 0, (x,y) ->

      it "should attempt to compute a path on topology 6", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 6
        astar = new ROT.Path.AStar toX, toY, passableCallback, options
        astar.compute 0, 0, (x,y) ->

      it "should attempt to compute a path on topology 4", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 4
        astar = new ROT.Path.AStar toX, toY, passableCallback, options
        astar.compute 0, 0, (x,y) ->

      it "should throw if an illegal topology is specified", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 7
        astar = new ROT.Path.AStar toX, toY, passableCallback, options
        should.throws(-> astar.compute 0, 0, (x,y) ->)

      it "should bail if it's not possible to find a path", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> false
        options =
          topology: 8
        astar = new ROT.Path.AStar toX, toY, passableCallback, options
        astar.compute 0, 0, (x,y) ->

#----------------------------------------------------------------------------
# end of astarTest.coffee
