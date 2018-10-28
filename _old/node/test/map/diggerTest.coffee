# diggerTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "digger", ->
  it "should export ROT.Map.Digger", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Digger"

  it "should be possible to create a Digger object", ->
    dungeon = new ROT.Map.Digger()
    dungeon.should.be.ok

  describe "Digger", ->
    it "should extend ROT.Map.Dungeon", ->
      dungeon = new ROT.Map.Digger()
      dungeon.should.be.an.instanceof ROT.Map
      dungeon.should.be.an.instanceof ROT.Map.Dungeon
      dungeon.should.be.an.instanceof ROT.Map.Digger
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        dungeon = new ROT.Map.Digger()
        dungeon.create (x, y, value) ->
          almostDone()

      it "should accept options like timelimit", ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        dungeon = new ROT.Map.Digger DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          roomWidth: [3, 9]
          roomHeight: [3, 5]
          corridorLength: [3, 10]
          dugPercentage: 0.2
          timeLimit: 1
        dungeon.create()

      it "should not dig when it has no walls", ->
        dungeon = new ROT.Map.Digger()
        dungeon._findWall = -> null
        dungeon.create()

    describe "_findWall", ->
      it "should return null when it can't find any walls", ->
        dungeon = new ROT.Map.Digger()
        dungeon._walls = {}
        wall = dungeon._findWall()
        should(wall).equal null

    describe "getRooms", ->
      it "should not return an empty array", ->
        dungeon = new ROT.Map.Digger()
        dungeon.create()
        rooms = dungeon.getRooms()
        rooms.length.should.be.greaterThan 1

    describe "getCorridors", ->
      it "should not return an empty array", ->
        dungeon = new ROT.Map.Digger()
        dungeon.create()
        corridors = dungeon.getCorridors()
        corridors.length.should.be.greaterThan 1

#----------------------------------------------------------------------------
# end of diggerTest.coffee
