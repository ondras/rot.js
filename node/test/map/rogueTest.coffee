# rogueTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "rogue", ->
  it "should export ROT.Map.Rogue", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Rogue"

  it "should be possible to create a Rogue object", ->
    dungeon = new ROT.Map.Rogue()
    dungeon.should.be.ok

  describe "Rogue", ->
    xit "should extend ROT.Map.Dungeon", ->
      dungeon = new ROT.Map.Rogue()
      dungeon.should.be.an.instanceof ROT.Map
      dungeon.should.be.an.instanceof ROT.Map.Dungeon
      dungeon.should.be.an.instanceof ROT.Map.Rogue
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        dungeon = new ROT.Map.Rogue()
        dungeon.create (x, y, value) ->
          almostDone()
        dungeon._options.should.have.properties [ "roomWidth", "roomHeight" ]

      it "should accept options", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        dungeon = new ROT.Map.Rogue DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          cellWidth: 3
          cellHeight: 3
        dungeon.create (x, y, value) ->
          almostDone()

      it "should accept extended options", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        dungeon = new ROT.Map.Rogue DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          cellWidth: 3
          cellHeight: 3
          roomHeight: [2, 6]
          roomWidth: [6, 21]
        dungeon.create (x, y, value) ->
          almostDone()

      it "should be OK if no callback is provided", ->
        dungeon = new ROT.Map.Rogue()
        dungeon.create()

    describe "getRooms", ->
      xit "should not return an empty array", ->
        dungeon = new ROT.Map.Rogue()
        dungeon.create()
        rooms = dungeon.getRooms()
        rooms.length.should.be.greaterThan 1

    describe "getCorridors", ->
      xit "should not return an empty array", ->
        dungeon = new ROT.Map.Rogue()
        dungeon.create()
        corridors = dungeon.getCorridors()
        corridors.length.should.be.greaterThan 1

    describe "_calculateRoomSize", ->
      it "should ensure a minimum size of 2", ->
        dungeon = new ROT.Map.Rogue()
        [min, max] = dungeon._calculateRoomSize 1, 1
        min.should.equal 2
        max.should.equal 2

    describe "_connectUnconnectedRooms", ->
      it "should keep looping until it finds a valid room", ->
        dungeon = new ROT.Map.Rogue()
        dungeon.connectedCells = []
        newRoom = ->
          return room =
            connections: []
        dungeon.rooms = (newRoom() for x in [0...3] for y in [0...3])
        dungeon._connectUnconnectedRooms()

      it "should skip rooms that are already connected to each other", ->
        dungeon = new ROT.Map.Rogue()
        dungeon.connectedCells = []
        newRoom = ->
          return room =
            connections: []
        dungeon.rooms = (newRoom() for x in [0...3] for y in [0...3])
        for x in [0...3]
          for y in [0...3]
            if (x isnt 0) and (y isnt 0)
              for i in [0...3]
                for j in [0...3]
                  if (i isnt 0) and (j isnt 0)
                    dungeon.rooms[x][y].connections.push [i,j]
        dungeon._connectUnconnectedRooms()

      it "should log if it can't connect a room", ->
        dungeon = new ROT.Map.Rogue()
        dungeon.connectedCells = []
        dungeon._options.cellWidth = 1
        dungeon._options.cellHeight = 1
        newRoom = ->
          return room =
            connections: []
        dungeon.rooms = (newRoom() for x in [0...1] for y in [0...1])
        dungeon._connectUnconnectedRooms()

    describe "_createRooms", ->
      it "should create some very small rooms", ->
        w = 9
        h = 9
        cw = 3
        ch = 3
        roomWidth = [2, 6]
        roomHeight = [2, 6]
        dungeon = new ROT.Map.Rogue 9, 9
        dungeon._width = w
        dungeon._height = h
        dungeon._options.cellWidth = cw
        dungeon._options.cellHeight = ch
        dungeon._options.roomWidth = roomWidth
        dungeon._options.roomHeight = roomHeight
        dungeon.rooms = []
        dungeon.map = dungeon._fillMap 0
        dungeon._initRooms()
        dungeon._createRooms()

      it "should create some small rooms", ->
        w = 10
        h = 10
        cw = 3
        ch = 3
        roomWidth = [2, 6]
        roomHeight = [2, 6]
        dungeon = new ROT.Map.Rogue 10, 10
        dungeon._width = w
        dungeon._height = h
        dungeon._options.cellWidth = cw
        dungeon._options.cellHeight = ch
        dungeon._options.roomWidth = roomWidth
        dungeon._options.roomHeight = roomHeight
        dungeon.rooms = []
        dungeon.map = dungeon._fillMap 0
        dungeon._initRooms()
        dungeon._createRooms()

    describe "_getWallPosition", ->
      it "should return [undefined, undefined] with a bad direction", ->
        dungeon = new ROT.Map.Rogue()
        [rx,ry] = dungeon._getWallPosition {}, 0
        should(rx).equal undefined
        should(ry).equal undefined

    describe "_createCorridors", (done) ->
      almostDone = _.after 3, done
      it "should call _drawCorridore badly if given a room connected to itself", ->
        dungeon = new ROT.Map.Rogue()
        dungeon._getWallPosition = (room, dir) ->
          almostDone() if (room is undefined) and (dir is undefined)
        dungeon._drawCorridore = ->
          almostDone()
        dungeon._options.cellWidth = 1
        dungeon._options.cellHeight = 1
        room =
          connections: []
          cellx: 0
          celly: 0
        room.connections.push [0,0]
        dungeon.rooms = []
        dungeon.rooms.push [room]
        dungeon._createCorridors()

#----------------------------------------------------------------------------
# end of rogueTest.coffee
