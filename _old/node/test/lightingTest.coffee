# lightingTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../lib/rot"

describe "lighting", ->
  it "should export ROT.Lighting", ->
    ROT.should.have.property "Lighting"
  
  it "should be possible to create a Lighting object without options", ->
    lighting = new ROT.Lighting()
    lighting.should.be.ok
  
  describe "Lighting", ->
    describe "Lighting", ->
      it "should be possible to create a Lighting object with options", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        lighting.should.be.ok
        
    describe "setOptions", ->
      it "should call reset() if a new range is provided", (done) ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        lighting.reset = -> done()
        lighting.setOptions(options).should.equal lighting

      it "should not call reset() if a new range is not provided", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        lighting.reset = -> throw new Error "I will not be reset!"
        newOptions =
          passes: 2
          emissionThreshold: 50
        lighting.setOptions(newOptions).should.equal lighting

    describe "setFOV", ->
      it "should cache the provided fov object", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        MOCK_fov =
          name: "I am FOV!"
        should(lighting._fov).equal null
        lighting.setFOV MOCK_fov
        lighting._fov.should.equal MOCK_fov

      it "should clear the FOV cache when provided a new fov object", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        lighting._fovCache =
          name: "I am FOV cache!"
        MOCK_fov =
          name: "I am FOV!"
        lighting._fovCache.should.not.eql {}
        lighting.setFOV MOCK_fov
        lighting._fovCache.should.eql {}

    describe "setLight", ->
      it "should add a light to the light sources", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        should(lighting._lights["5,5"]).equal undefined
        lighting.setLight 5, 5, "blue"
        lighting._lights["5,5"].should.be.ok

      it "should add a light to the light sources", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        should(lighting._lights["7,7"]).equal undefined
        lighting.setLight 7, 7, [123, 45, 67]
        lighting._lights["7,7"].should.be.ok

      it "should remove lights when provided null", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        should(lighting._lights["5,5"]).equal undefined
        should(lighting._lights["7,7"]).equal undefined
        lighting.setLight 5, 5, "blue"
        lighting.setLight 7, 7, [123, 45, 67]
        lighting._lights["5,5"].should.be.ok
        lighting._lights["7,7"].should.be.ok
        lighting.setLight 5, 5, null
        should(lighting._lights["5,5"]).equal undefined
        lighting._lights["7,7"].should.be.ok

    describe "clearLights", ->
      it "should remove all lights", ->
        reflectivityCallback = ->
        options =
          passes: 1
          emissionThreshold: 100
          range: 10          
        lighting = new ROT.Lighting reflectivityCallback, options
        lighting._lights.should.eql {}
        should(lighting._lights["5,5"]).equal undefined
        should(lighting._lights["7,7"]).equal undefined
        lighting.setLight 5, 5, "blue"
        lighting.setLight 7, 7, [123, 45, 67]
        lighting._lights["5,5"].should.be.ok
        lighting._lights["7,7"].should.be.ok
        lighting.clearLights()
        should(lighting._lights["5,5"]).equal undefined
        should(lighting._lights["7,7"]).equal undefined
        lighting._lights.should.eql {}

    describe "compute", ->
      it "should light some stuff up", ->
        # based on the code example from the Interactive Manual
        ROT.RNG.setSeed 12345
        mapData = {}
        lightData = {}

        # build a map
        map = new ROT.Map.Cellular(60,40).randomize(0.5)
        createCallback = (x, y, value) ->
          mapData["#{x},#{y}"] = value
        for i in [0...4]
          map.create(createCallback)

        # prepare a FOV algorithm
        lightPasses = (x, y) -> mapData["#{x},#{y}"] is 1
        fov = new ROT.FOV.PreciseShadowcasting lightPasses, { topology:4 }

        # prepare a lighting algorithm
        reflectivity = (x, y) ->
          return if mapData["#{x},#{y}"] is 1 then 0.3 else 0
        lighting = new ROT.Lighting reflectivity, { range:12, passes:3 }
        lighting.setFOV(fov)
        lighting.setLight(12, 12, [240, 240, 30])
        lighting.setLight(20, 20, [240, 60, 60])
        lighting.setLight(45, 25, [200, 200, 200])

        lightingCallback = (x, y, color) ->
            lightData["#{x},#{y}"] = color
        lighting.compute(lightingCallback)

      it "should re-light some stuff up, if a light goes out", ->
        # based on the code example from the Interactive Manual
        ROT.RNG.setSeed 12345
        mapData = {}
        lightData = {}

        # build a map
        map = new ROT.Map.Cellular(60,40).randomize(0.5)
        createCallback = (x, y, value) ->
          mapData["#{x},#{y}"] = value
        for i in [0...4]
          map.create(createCallback)

        # prepare a FOV algorithm
        lightPasses = (x, y) -> mapData["#{x},#{y}"] is 1
        fov = new ROT.FOV.PreciseShadowcasting lightPasses, { topology:4 }

        # prepare a lighting algorithm
        reflectivity = (x, y) ->
          return if mapData["#{x},#{y}"] is 1 then 0.3 else 0
        lighting = new ROT.Lighting reflectivity, { range:12, passes:3 }
        lighting.setFOV(fov)
        lighting.setLight(12, 12, [240, 240, 30])
        lighting.setLight(20, 20, [240, 60, 60])
        lighting.setLight(45, 25, [200, 200, 200])

        lightingCallback = (x, y, color) ->
            lightData["#{x},#{y}"] = color
        lighting.compute(lightingCallback)
        
        # remove the second light and recompute
        lighting.setLight(20, 20, null)
        lighting.compute(lightingCallback)

#----------------------------------------------------------------------------
# end of lightingTest.coffee
