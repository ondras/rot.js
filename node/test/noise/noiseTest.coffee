# noiseTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "noise", ->
  it "should export ROT.Noise", ->
    ROT.should.have.property "Noise"

  it "should be possible to create a Noise object", ->
    noise = new ROT.Noise()
    noise.should.have.property "get"

  describe "Noise", ->
    describe "get", ->
      it "should not do anything", ->
        noise = new ROT.Noise()
        result = noise.get 5, 5
        should(result).equal undefined

#----------------------------------------------------------------------------
# end of noiseTest.coffee
