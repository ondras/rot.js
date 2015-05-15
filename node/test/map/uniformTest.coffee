# uniformTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "uniform", ->
  it "should export ROT.Map.Uniform", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Uniform"

  it "should be possible to create a Uniform object", ->
    dungeon = new ROT.Map.Uniform()
    dungeon.should.be.ok

  describe "Uniform", ->
    it "should extend ROT.Map.Dungeon", ->
      dungeon = new ROT.Map.Uniform()
      dungeon.should.be.an.instanceof ROT.Map
      dungeon.should.be.an.instanceof ROT.Map.Dungeon
      dungeon.should.be.an.instanceof ROT.Map.Uniform
  
    describe "create", ->
      it "should call the callback width x height times", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        dungeon = new ROT.Map.Uniform()
        dungeon.create (x, y, value) ->
          almostDone()

      it "should accept options, like timeLimit", (done) ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = _.after DEFAULT_WIDTH*DEFAULT_HEIGHT, done
        dungeon = new ROT.Map.Uniform DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          timeLimit: 10
        dungeon.create (x, y, value) ->
          almostDone()

      it "should not call the callback if given no time", ->
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        almostDone = -> throw new Error "bad mojo"
        dungeon = new ROT.Map.Uniform DEFAULT_WIDTH, DEFAULT_HEIGHT, MOCK_options =
          timeLimit: -1
        dungeon.create (x, y, value) ->
          almostDone()

      it "should keep trying to create rooms if there are less than two", ->
        firstTime = true
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        dungeon = new ROT.Map.Uniform()
        oldGenerateRooms = dungeon._generateRooms
        dungeon._generateRooms = ->
          dungeon._generateRooms = oldGenerateRooms
          return
        dungeon.create()

      it "should keep trying to create corridors if not successful", ->
        firstTime = true
        { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT
        dungeon = new ROT.Map.Uniform()
        oldGenerateCorridors = dungeon._generateCorridors
        dungeon._generateCorridors = ->
          dungeon._generateCorridors = oldGenerateCorridors
          return false
        dungeon.create()

    describe "getRooms", ->
      it "should not return an empty array", ->
        dungeon = new ROT.Map.Uniform()
        dungeon.create()
        rooms = dungeon.getRooms()
        rooms.length.should.be.greaterThan 1

    describe "getCorridors", ->
      it "should not return an empty array", ->
        dungeon = new ROT.Map.Uniform()
        dungeon.create()
        corridors = dungeon.getCorridors()
        corridors.length.should.be.greaterThan 1

    describe "_generateRoom", ->
      it "should respect the limit on the number of attempts", ->
        dungeon = new ROT.Map.Uniform()
        dungeon._roomAttempts = 0
        room = dungeon._generateRoom()
        should(room).equal null

    describe "_generateCorridors", ->
      it "should respect the limit on the number of attempts", ->
        dungeon = new ROT.Map.Uniform()
        dungeon._corridorAttempts = 0
        corridor = dungeon._generateCorridors()
        corridor.should.equal false

      it "should not try to connect a room it doesn't have", ->
        dungeon = new ROT.Map.Uniform()
        dungeon._closestRoom = ->
        dungeon._connectRooms = ->
        corridor = dungeon._generateCorridors()
        corridor.should.equal false

    describe "_connectRooms", ->
      it "should return if it can't find a place to start", ->
        dungeon = new ROT.Map.Uniform()
        dungeon._placeInWall = -> null
        room1 =
          getCenter: -> [42, 42]
          getTop: -> 40
          getBottom: -> 44
        room2 =
          getCenter: -> [69, 69]
          getTop: -> 67
          getBottom: -> 71
        success = dungeon._connectRooms room1, room2
        success.should.equal false

      it "should try connecting east-west if closer left-right than up-down", ->
        dungeon = new ROT.Map.Uniform()
        dungeon._placeInWall = -> null
        room1 =
          getCenter: -> [52, 42]
          getLeft: -> 50
          getRight: -> 54
        room2 =
          getCenter: -> [59, 69]
          getLeft: -> 57
          getRight: -> 61
        success = dungeon._connectRooms room1, room2
        success.should.equal false

      it "should return if it can't find a place to end (L-shape)", ->
        nextTime = [42, 44]
        dungeon = new ROT.Map.Uniform()
        dungeon._placeInWall = ->
          returnThis = nextTime
          nextTime = null
          return returnThis
        room1 =
          getCenter: -> [42, 42]
          getTop: -> 40
          getBottom: -> 44
        room2 =
          getCenter: -> [69, 69]
          getTop: -> 67
          getBottom: -> 71
        success = dungeon._connectRooms room1, room2
        success.should.equal false

      it "should return if it can't find a place to end (S-shape)", ->
        nextTime = [14, 10]
        dungeon = new ROT.Map.Uniform()
        dungeon._digLine = (array) ->
          throw new Error "First Case" if array.length is 2
          throw new Error "Second Case" if array.length is 3
          throw new Error "Proper Case" if array.length is 4
          throw new Error "WTF???"
        dungeon._placeInWall = ->
          returnThis = nextTime
          nextTime = null
          return returnThis
        room1 =
          getCenter: -> [10, 5]
          getLeft: -> 5
          getRight: -> 15
          getTop: -> 0
          getBottom: -> 10
        room2 =
          getCenter: -> [20, 500]
          getLeft: -> 15
          getRight: -> 25
          getTop: -> 495
          getBottom: -> 505
        success = dungeon._connectRooms room1, room2
        success.should.equal false

      it "should add room1 and room2 to the connected list if they aren't", ->
        room1 =
          getCenter: -> [10, 5]
          getLeft: -> 5
          getRight: -> 15
          getTop: -> 0
          getBottom: -> 10
          addDoor: ->
        room2 =
          getCenter: -> [20, 500]
          getLeft: -> 15
          getRight: -> 25
          getTop: -> 495
          getBottom: -> 505
          addDoor: ->
        dungeon = new ROT.Map.Uniform()
        dungeon._placeInWall = -> [10, 10]
        dungeon._digLine = ->
        dungeon._connected = [ room1 ]
        dungeon._unconnected = [ room2 ]
        success = dungeon._connectRooms room1, room2
        success.should.equal true

    describe "_placeInWall", ->
      it "should return null if there are no available walls", ->
        TOP_WALL = 0
        dungeon = new ROT.Map.Uniform 20, 20
        dungeon._map = dungeon._fillMap 0
        room =
          addDoor: ->
          getCenter: -> [10, 10]
          getLeft: -> 5
          getRight: -> 15
          getTop: -> 5
          getBottom: -> 15
        wall = dungeon._placeInWall room, TOP_WALL
        should(wall).equal null

    describe "_isWallCallback", ->
      it "should return false if coordinates are out of bounds", ->
        dungeon = new ROT.Map.Uniform 20, 20
        dungeon._isWallCallback(-1, 5).should.equal false 
        dungeon._isWallCallback(5, -1).should.equal false 
        dungeon._isWallCallback(25, 5).should.equal false 
        dungeon._isWallCallback(5, 25).should.equal false 

    describe "_canBeDugCallback", ->
      it "should return false if coordinates are out of bounds", ->
        dungeon = new ROT.Map.Uniform 20, 20
        dungeon._canBeDugCallback(-1, 5).should.equal false 
        dungeon._canBeDugCallback(5, -1).should.equal false 
        dungeon._canBeDugCallback(25, 5).should.equal false 
        dungeon._canBeDugCallback(5, 25).should.equal false

#----------------------------------------------------------------------------
# end of uniformTest.coffee
