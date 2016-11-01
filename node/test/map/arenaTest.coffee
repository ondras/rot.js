# arenaTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "arena", ->
  it "should export ROT.Map.Arena", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Arena"

  it "should be possible to create an Arena object", ->
    arena = new ROT.Map.Arena()
    arena.should.be.ok

  describe "Arena", ->
    it "should extend ROT.Map", ->
      arena = new ROT.Map.Arena()
      arena.should.be.an.instanceof ROT.Map
      arena.should.be.an.instanceof ROT.Map.Arena
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        arena = new ROT.Map.Arena()
        arena.create (x, y, value) ->
          almostDone()

      it "should create a fully dug room", ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        arena = new ROT.Map.Arena()
        arena.create (x, y, value) ->
          if (x is 0)
            throw new Error "bad mojo" if value isnt 1
          else if (y is 0)
            throw new Error "bad mojo" if value isnt 1
          else if (x is DEFAULT_WIDTH-1)
            throw new Error "bad mojo" if value isnt 1
          else if (y is DEFAULT_HEIGHT-1)
            throw new Error "bad mojo" if value isnt 1
          else
            throw new Error "bad mojo" if value isnt 0

#----------------------------------------------------------------------------
# end of arenaTest.coffee
