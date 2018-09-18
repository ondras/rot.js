# fovTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "fov", ->
  it "should export ROT.FOV", ->
    ROT.should.have.property "FOV"

  it "should be possible to create a FOV object", ->
    fov = new ROT.FOV()
    fov.should.have.properties [ "compute", "_getCircle" ]

  describe "FOV", ->
    it "should accept options", ->
      lightCallback = (x, y) -> false
      options =
    		topology: 8
      fov = new ROT.FOV lightCallback, options
      
    describe "compute", ->
      it "should not do anything", ->
        fov = new ROT.FOV()
        result = fov.compute()
        should(result).equal undefined

    describe "_getCircle", ->
      fov = null
      
      describe "topology: 4", ->
        beforeEach ->
          lightCallback = (x, y) -> false
          options =
            topology: 4
          fov = new ROT.FOV lightCallback, options

        it "should return top4 neighbors", ->
          result = fov._getCircle 0, 0, 1
          result.length.should.equal 4

      describe "topology: 6", ->
        beforeEach ->
          lightCallback = (x, y) -> false
          options =
            topology: 6
          fov = new ROT.FOV lightCallback, options

        it "should return top6 neighbors", ->
          result = fov._getCircle 0, 0, 1
          result.length.should.equal 6

      describe "topology: 8", ->
        beforeEach ->
          lightCallback = (x, y) -> false
          options =
            topology: 8
          fov = new ROT.FOV lightCallback, options

        it "should return top8 neighbors", ->
          result = fov._getCircle 0, 0, 1
          result.length.should.equal 8

#----------------------------------------------------------------------------
# end of fovTest.coffee
