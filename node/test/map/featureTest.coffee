# featureTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "feature", ->
  it "should export ROT.Map.Feature", ->
    ROT.should.have.property "Map"
    ROT.Map.should.have.property "Feature"

  describe "Feature", ->
    it "should have a static method to create the feature", ->
      ROT.Map.Feature.should.have.property "createRandomAt"

    it "should be possible to create a Feature object", ->
      feature = new ROT.Map.Feature()
      feature.should.have.properties [ "create", "debug", "isValid" ]
      
    describe "createRandomAt", ->
      it "should not do anything", ->
        result = ROT.Map.Feature.createRandomAt()
        should(result).equal undefined

    describe "create", ->
      it "should not do anything", ->
        feature = new ROT.Map.Feature()
        result = feature.create()
        should(result).equal undefined

    describe "debug", ->
      it "should not do anything", ->
        feature = new ROT.Map.Feature()
        result = feature.debug()
        should(result).equal undefined

    describe "isValid", ->
      it "should not do anything", ->
        feature = new ROT.Map.Feature()
        result = feature.isValid()
        should(result).equal undefined

  describe "Room", ->
    it "should extend ROT.Map.Feature", ->
      room = new ROT.Map.Feature.Room()
      room.should.be.an.instanceof ROT.Map.Feature
      room.should.be.an.instanceof ROT.Map.Feature.Room

    it "should be possible to create a Room object", ->
      room = new ROT.Map.Feature.Room()
      room.should.have.properties [ "create", "debug", "isValid" ]
      room.should.have.properties [ "getDoors" ]
      
    describe "createRandomAt", ->
      it "should have a static method to create the feature", ->
        ROT.Map.Feature.Room.should.have.property "createRandomAt"
        ROT.Map.Feature.Room.should.have.property "createRandomCenter"

      it "should throw an error if dx and dy are 0", ->
        x = 0
        y = 0
        dx = 0
        dy = 0
        options =
          roomWidth: [5, 5]
          roomHeight: [5, 5]
        should.throws(-> ROT.Map.Feature.Room.createRandomAt x, y, dx, dy, options)

    describe "getDoors", ->
      it "should provide doors to the callback", (done) ->
        almostDone = _.after 3, done
        room = new ROT.Map.Feature.Room()
        room.addDoor 1, 1
        room.addDoor 2, 2
        room.addDoor 3, 3
        room.getDoors (x,y) ->
          almostDone() if x is y

    describe "debug", ->
      it "should log if called", ->
        room = new ROT.Map.Feature.Room 1, 1, 5, 5
        room.debug()

  describe "Corridor", ->
    it "should extend ROT.Map.Feature", ->
      corridor = new ROT.Map.Feature.Corridor()
      corridor.should.be.an.instanceof ROT.Map.Feature
      corridor.should.be.an.instanceof ROT.Map.Feature.Corridor

    it "should be possible to create a Corridor object", ->
      corridor = new ROT.Map.Feature.Corridor()
      corridor.should.have.properties [ "create", "debug", "isValid" ]
      corridor.should.have.properties [ "createPriorityWalls" ]
      
    describe "debug", ->
      it "should log if called", ->
        corridor = new ROT.Map.Feature.Corridor 1, 5, 5, 5
        corridor.debug()

    describe "isValid", ->
      it "should return false if the corridor is length 0", ->
        corridor = new ROT.Map.Feature.Corridor 1, 1, 1, 1
        isWallCallback = (x,y) -> false
        canBeDugCallback = (x,y) -> false
        result = corridor.isValid isWallCallback, canBeDugCallback
        result.should.equal false

#----------------------------------------------------------------------------
# end of featureTest.coffee
