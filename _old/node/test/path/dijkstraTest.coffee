# dijkstraTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "dijkstra", ->
  it "should export ROT.Path.Dijkstra", ->
    ROT.should.have.property "Path"
    ROT.Path.should.have.property "Dijkstra"

  it "should be possible to create a Dijkstra object", ->
    dijkstra = new ROT.Path.Dijkstra()
    dijkstra.should.be.ok

  describe "Dijkstra", ->
    it "should extend ROT.Path", ->
      dijkstra = new ROT.Path.Dijkstra()
      dijkstra.should.be.an.instanceof ROT.Path
      dijkstra.should.be.an.instanceof ROT.Path.Dijkstra

    describe "compute", ->
      it "should bail out if unable to cache a result", ->
        dijkstra = new ROT.Path.Dijkstra()
        dijkstra._compute = ->
        dijkstra.compute 0, 0, (x,y) ->

      it "should attempt to compute a path", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 8
        dijkstra = new ROT.Path.Dijkstra toX, toY, passableCallback, options
        dijkstra.compute 0, 0, (x,y) ->

      it "should reuse a path it already has", ->
        toX = 5
        toY = 5
        passableCallback = (x,y) -> true
        options =
          topology: 8
        dijkstra = new ROT.Path.Dijkstra toX, toY, passableCallback, options
        dijkstra.compute 0, 0, (x,y) ->
        dijkstra.compute 0, 0, (x,y) ->

#----------------------------------------------------------------------------
# end of dijkstraTest.coffee
