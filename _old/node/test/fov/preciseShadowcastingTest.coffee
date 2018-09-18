# preciseShadowcastingTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

map = (mapArray) -> (line.split "" for line in mapArray)

describe "precise-shadowcasting", ->
  it "should export ROT.FOV.PreciseShadowcasting", ->
    ROT.should.have.property "FOV"
    ROT.FOV.should.have.property "PreciseShadowcasting"

  it "should be possible to create a PreciseShadowcasting object", ->
    ps = new ROT.FOV.PreciseShadowcasting()
    ps.should.have.properties [ "compute", "_getCircle" ]

  describe "PreciseShadowcasting", ->
    it "should extend ROT.FOV", ->
      ps = new ROT.FOV.PreciseShadowcasting()
      ps.should.be.an.instanceof ROT.FOV
      ps.should.be.an.instanceof ROT.FOV.PreciseShadowcasting

    describe "compute", ->
      it "should bail if we're standing in solid earth", (done) ->
        lightPasses = (x, y) -> false
        canSee = (x, y, r, visible) -> done()
        ps = new ROT.FOV.PreciseShadowcasting lightPasses
        ps.compute 0, 0, 10, canSee

      it "should shadowcast if we can see stuff", ->
        canSeeCount = 0
        testMap = map [
        #  0123456789
          "XXXXXXXXXX" # 0
          "X........X" # 1
          "X........X" # 2
          "X........X" # 3
          "XXXXXXXXXX" ] # 4
        lightPasses = (x, y) ->
          return false if x < 0
          return false if y < 0
          return false if x >= testMap[0].length
          return false if y >= testMap.length
          testMap[y][x] is "."
        canSee = (x, y, r, visible) -> canSeeCount++ if visible is 1
        ps = new ROT.FOV.PreciseShadowcasting lightPasses
        ps.compute 5, 2, 10, canSee
        canSeeCount.should.equal 40

    describe "_checkVisibility", ->
      it "should return 0 when completely equivalent with existing shadow", ->
        lightPasses = (x,y) -> false
        ps = new ROT.FOV.PreciseShadowcasting lightPasses
        A1 = [0, 0]
        A2 = [0, 0]
        blocks = false
        SHADOWS = [[0,0], [0,0]]
        ps._checkVisibility(A1, A2, blocks, SHADOWS).should.equal 0

      it "should - second edge within existing shadow, first outside", ->
        lightPasses = (x,y) -> false
        ps = new ROT.FOV.PreciseShadowcasting lightPasses
        A1 = [0, 5]
        A2 = [10, 5]
        blocks = false
        SHADOWS = [[8,12]]
        ps._checkVisibility(A1, A2, blocks, SHADOWS).should.be.within 0.3, 0.34

      it "should - both edges within existing shadows", ->
        lightPasses = (x,y) -> false
        ps = new ROT.FOV.PreciseShadowcasting lightPasses
        A1 = [4, 5]
        A2 = [8, 5]
        blocks = false
        SHADOWS = [[3,4],[4,5],[5,6],[6,8],[11,13]]
        ps._checkVisibility(A1, A2, blocks, SHADOWS).should.be.within 0.05, 0.06

#----------------------------------------------------------------------------
# end of preciseShadowcastingTest.coffee
