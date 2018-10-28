# rngTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../lib/rot"

describe "rng", ->
  it "should export ROT.RNG", ->
    ROT.should.have.property "RNG"
    
  it "should automatically seed the RNG", ->
    ROT.RNG._seed.should.be.ok
  
  describe "RNG", ->
    describe "getSeed", ->
      it "should return the seed", ->
        seed = ROT.RNG.getSeed()
        seed.should.equal ROT.RNG._seed

    describe "setSeed", ->
      it "should be able to handle less than 1", ->
        ROT.RNG.setSeed 0.5
        ROT.RNG._seed.should.be.a.Number
        ROT.RNG._s0.should.be.a.Number
        ROT.RNG._s1.should.be.a.Number
        ROT.RNG._s2.should.be.a.Number
        ROT.RNG._c.should.be.a.Number
        ROT.RNG._frac.should.be.a.Number
        
      it "should be able to handle 0", ->
        ROT.RNG.setSeed 0
        ROT.RNG._seed.should.be.a.Number
        ROT.RNG._s0.should.be.a.Number
        ROT.RNG._s1.should.be.a.Number
        ROT.RNG._s2.should.be.a.Number
        ROT.RNG._c.should.be.a.Number
        ROT.RNG._frac.should.be.a.Number

    describe "getUniform", ->
      it "should modify the state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG
        uniform = ROT.RNG.getUniform()
        ROT.RNG._seed.should.equal _seed
        ROT.RNG._frac.should.equal _frac
        ROT.RNG._s0.should.not.equal _s0
        ROT.RNG._s1.should.not.equal _s1
        ROT.RNG._s2.should.not.equal _s2
        ROT.RNG._c.should.not.equal _c
        
      it "should return a value between [0,1)", ->
        ROT.RNG.setSeed Date.now()
        uniform = ROT.RNG.getUniform()
        uniform.should.be.within 0.0, 1.0
        uniform.should.be.below 1.0

    describe "getUniformInt", ->
      it "should modify the state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG
        uniformInt = ROT.RNG.getUniformInt 1, 6
        ROT.RNG._seed.should.equal _seed
        ROT.RNG._frac.should.equal _frac
        ROT.RNG._s0.should.not.equal _s0
        ROT.RNG._s1.should.not.equal _s1
        ROT.RNG._s2.should.not.equal _s2
        ROT.RNG._c.should.not.equal _c
        
      it "should return a value between [1,6]", ->
        ROT.RNG.setSeed Date.now()
        uniform = ROT.RNG.getUniformInt 1, 6
        uniform.should.be.within 1, 6

    describe "getNormal", ->
      it "should modify the state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG
        normal = ROT.RNG.getNormal 250, 100
        ROT.RNG._seed.should.equal _seed
        ROT.RNG._frac.should.equal _frac
        ROT.RNG._s0.should.not.equal _s0
        ROT.RNG._s1.should.not.equal _s1
        ROT.RNG._s2.should.not.equal _s2
        ROT.RNG._c.should.not.equal _c

      it "should work without parameters", ->
        ROT.RNG.setSeed Date.now()
        normal = ROT.RNG.getNormal()
        normal.should.be.ok

    describe "getPercentage", ->
      it "should modify the state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG
        percentage = ROT.RNG.getPercentage()
        ROT.RNG._seed.should.equal _seed
        ROT.RNG._frac.should.equal _frac
        ROT.RNG._s0.should.not.equal _s0
        ROT.RNG._s1.should.not.equal _s1
        ROT.RNG._s2.should.not.equal _s2
        ROT.RNG._c.should.not.equal _c
        
      it "should return a value between [1,100]", ->
        ROT.RNG.setSeed Date.now()
        percentage = ROT.RNG.getPercentage()
        percentage.should.be.within 1, 100

    describe "getWeightedValue", ->
      it "should modify the state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG
        value = ROT.RNG.getWeightedValue MOCK_data =
          red: 9
          green: 1
        ROT.RNG._seed.should.equal _seed
        ROT.RNG._frac.should.equal _frac
        ROT.RNG._s0.should.not.equal _s0
        ROT.RNG._s1.should.not.equal _s1
        ROT.RNG._s2.should.not.equal _s2
        ROT.RNG._c.should.not.equal _c
        
      it "should return one of the values provided", ->
        ROT.RNG.setSeed Date.now()
        value = ROT.RNG.getWeightedValue MOCK_data =
          red: 9
          green: 1
        ["red", "green"].should.matchAny value

      it "should return the last value if we go beyond the list", ->
        ROT.RNG.setSeed Date.now()
        value = ROT.RNG.getWeightedValue MOCK_data =
          red: 0
          green: 0
          blue: 0
        value.should.equal "blue"

    describe "getState", ->
      it "should return the internal state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG
        [s0, s1, s2, c] = ROT.RNG.getState()
        s0.should.equal _s0
        s1.should.equal _s1
        s2.should.equal _s2
        c.should.equal _c

    describe "setState", ->
      it "should set the internal state of the RNG", ->
        ROT.RNG.setSeed Date.now()
        [_s0, _s1, _s2, _c] = ROT.RNG.getState()
        roll1 = ROT.RNG.getUniformInt 1, 6
        roll2 = ROT.RNG.getUniformInt 1, 6
        roll3 = ROT.RNG.getUniformInt 1, 6
        ROT.RNG.setState [_s0, _s1, _s2, _c]
        rolla = ROT.RNG.getUniformInt 1, 6
        rollb = ROT.RNG.getUniformInt 1, 6
        rollc = ROT.RNG.getUniformInt 1, 6
        roll1.should.equal rolla
        roll2.should.equal rollb
        roll3.should.equal rollc

    describe "clone", ->
      it "should create a perfect clone of the RNG", ->
        ROT.RNG.setSeed Date.now()
        clone = ROT.RNG.clone()
        for i in [0...100]
          clone.getPercentage().should.equal ROT.RNG.getPercentage()

#----------------------------------------------------------------------------
# end of rngTest.coffee
