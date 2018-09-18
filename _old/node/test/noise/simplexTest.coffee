# simplexTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "simplex", ->
  it "should export ROT.Noise,Simplex", ->
    ROT.should.have.property "Noise"
    ROT.Noise.should.have.property "Simplex"

  it "should be possible to create a Simplex object", ->
    simplex = new ROT.Noise.Simplex()
    simplex.should.have.property "get"

  describe "Simplex", ->
    it "should extend ROT.Noise", ->
      simplex = new ROT.Noise.Simplex()
      simplex.should.be.an.instanceof ROT.Noise
  
    it "should accept a parameter gradients", ->
      simplex = new ROT.Noise.Simplex 128

    describe "get", ->
      it "should provide some smooth random noise", ->
        simplex = new ROT.Noise.Simplex()
        for x in [0...16] by 0.25
          for y in [0...16] by 0.25
            value = simplex.get x, y
            value.should.be.within -1, 1

#----------------------------------------------------------------------------
# end of simplexTest.coffee
