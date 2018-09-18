# discreteShadowcastingTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

map = (mapArray) -> (line.split "" for line in mapArray)

describe "discrete-shadowcasting", ->
  it "should export ROT.FOV.DiscreteShadowcasting", ->
    ROT.should.have.property "FOV"
    ROT.FOV.should.have.property "DiscreteShadowcasting"

  it "should be possible to create a DiscreteShadowcasting object", ->
    ds = new ROT.FOV.DiscreteShadowcasting()
    ds.should.have.properties [ "compute", "_getCircle" ]

  describe "DiscreteShadowcasting", ->
    it "should extend ROT.FOV", ->
      ds = new ROT.FOV.DiscreteShadowcasting()
      ds.should.be.an.instanceof ROT.FOV
      ds.should.be.an.instanceof ROT.FOV.DiscreteShadowcasting

    describe "compute", ->
      it "should bail if we're standing in solid earth", (done) ->
        lightPasses = (x, y) -> false
        canSee = (x, y, r, visible) -> done()
        ds = new ROT.FOV.DiscreteShadowcasting lightPasses
        ds.compute 0, 0, 10, canSee

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
        ds = new ROT.FOV.DiscreteShadowcasting lightPasses
        ds.compute 5, 2, 10, canSee
        canSeeCount.should.equal 50

#----------------------------------------------------------------------------
# end of discreteShadowcastingTest.coffee
