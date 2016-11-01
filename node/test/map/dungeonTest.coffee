# dungeonTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "dungeon", ->
  it "should export ROT.Map.Dungeon", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Dungeon"

  it "should be possible to create a Dungeon object", ->
    maze = new ROT.Map.Dungeon()
    maze.should.be.ok

  describe "Dungeon", ->
    it "should extend ROT.Map", ->
      maze = new ROT.Map.Dungeon()
      maze.should.be.an.instanceof ROT.Map
      maze.should.be.an.instanceof ROT.Map.Dungeon
  
    describe "create", ->
      it "should not do anything", ->
        maze = new ROT.Map.Dungeon()
        maze.create()

    describe "getRooms", ->
      it "should return an empty array", ->
        maze = new ROT.Map.Dungeon()
        rooms = maze.getRooms()
        rooms.should.be.ok

    describe "getCorridors", ->
      it "should return an empty array", ->
        maze = new ROT.Map.Dungeon()
        corridors = maze.getCorridors()
        corridors.should.be.ok

#----------------------------------------------------------------------------
# end of dungeonTest.coffee
