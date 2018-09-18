# recursiveShadowcastingTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

map = (mapArray) -> (line.split "" for line in mapArray)

describe "recursive-shadowcasting", ->
  it "should export ROT.FOV.RecursiveShadowcasting", ->
    ROT.should.have.property "FOV"
    ROT.FOV.should.have.property "RecursiveShadowcasting"

  it "should be possible to create a RecursiveShadowcasting object", ->
    rs = new ROT.FOV.RecursiveShadowcasting()
    rs.should.have.properties [ "compute", "_getCircle" ]

  describe "RecursiveShadowcasting", ->
    it "should extend ROT.FOV", ->
      rs = new ROT.FOV.RecursiveShadowcasting()
      rs.should.be.an.instanceof ROT.FOV
      rs.should.be.an.instanceof ROT.FOV.RecursiveShadowcasting

    describe "compute", ->
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
        rs = new ROT.FOV.RecursiveShadowcasting lightPasses
        rs.compute 5, 2, 10, canSee
        canSeeCount.should.equal 71

    describe "compute180", ->
      it "should shadowcast if we can see stuff", ->
        DIR_NORTH = 0
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
        rs = new ROT.FOV.RecursiveShadowcasting lightPasses
        rs.compute180 5, 2, 10, DIR_NORTH, canSee
        canSeeCount.should.equal 36

    describe "compute90", ->
      it "should shadowcast if we can see stuff", ->
        DIR_NORTH = 0
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
        rs = new ROT.FOV.RecursiveShadowcasting lightPasses
        rs.compute90 5, 2, 10, DIR_NORTH, canSee
        canSeeCount.should.equal 11

    describe "_castVisibility", ->
      it "should consider things out of range as invisible", ->
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
        rs = new ROT.FOV.RecursiveShadowcasting lightPasses
        rs.compute 5, 2, 1, canSee
        canSeeCount.should.equal 17

#----------------------------------------------------------------------------
# end of recursiveShadowcastingTest.coffee
