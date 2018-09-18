# colorTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../lib/rot"

describe "color", ->
  it "should export ROT.Color", ->
    ROT.should.have.property "Color"
  
  it "should have several methods for handling color", ->
    ROT.Color.should.have.properties [ "fromString", "add", "add_",
      "multiply", "multiply_", "interpolate", "interpolateHSL", "randomize",
      "rgb2hsl", "hsl2rgb", "toRGB", "toHex", "_clamp", "_cache" ]
  
  describe "Color", ->
    describe "fromString", ->
      it "should use named colors from the cache", ->
        aqua = ROT.Color.fromString "mediumaquamarine"
        aqua.should.eql [102, 205, 170]

      it "should accept #rgb style colors", ->
        color = ROT.Color.fromString "#abc"
        color.should.eql [170, 187, 204]

      it "should accept #rrggbb style colors", ->
        color = ROT.Color.fromString "#a7b7c7"
        color.should.eql [167, 183, 199]

      it "should accept rgb(rrr,ggg,bbb) style colors", ->
        color = ROT.Color.fromString "rgb(123, 45, 67)"
        color.should.eql [123, 45, 67]

      it "should return black #000 when the input is unknown", ->
        color = ROT.Color.fromString "elven mage"
        color.should.eql [0, 0, 0]

    describe "add", ->
      it "should add two colors together", ->
        a = [50, 100, 150]
        b = [3, 5, 7]
        color = ROT.Color.add a, b
        color.should.eql [53, 105, 157]
        a.should.eql [50, 100, 150]
        b.should.eql [3, 5, 7]

    describe "add_", ->
      it "should add two colors together, modifying the first", ->
        a = [50, 100, 150]
        b = [3, 5, 7]
        color = ROT.Color.add_ a, b
        color.should.eql [53, 105, 157]
        a.should.eql [53, 105, 157]
        b.should.eql [3, 5, 7]

    describe "multiply", ->
      it "should mix (multiply) two colors together", ->
        a = [50, 100, 150]
        b = [13, 234, 69]
        color = ROT.Color.multiply a, b
        color.should.eql [3, 92, 41]
        a.should.eql [50, 100, 150]
        b.should.eql [13, 234, 69]

    describe "multiply_", ->
      it "should mix (multiply) two colors together, modifying the first", ->
        a = [50, 100, 150]
        b = [13, 234, 69]
        color = ROT.Color.multiply_ a, b
        color.should.eql [3, 92, 41]
        a.should.eql [3, 92, 41]
        b.should.eql [13, 234, 69]

    describe "interpolate", ->
      it "should interpolate between two colors", ->
        a = [255, 0, 0]
        b = [0, 0, 255]
        color = ROT.Color.interpolate a, b
        color.should.eql [128, 0, 128]
        a.should.eql [255, 0, 0]
        b.should.eql [0, 0, 255]

      it "should interpolate between two colors by percentage", ->
        a = [255, 0, 0]
        b = [0, 0, 255]
        color = ROT.Color.interpolate a, b, 0.75
        color.should.eql [64, 0, 191]
        a.should.eql [255, 0, 0]
        b.should.eql [0, 0, 255]

    describe "rgb2hsl", ->
      it "should treat black as achromatic", ->
        hsl = ROT.Color.rgb2hsl [0, 0, 0]
        hsl.should.eql [0, 0, 0]

      it "should treat white as achromatic", ->
        hsl = ROT.Color.rgb2hsl [255, 255, 255]
        hsl.should.eql [0, 0, 1.0]

      it "should treat grey as achromatic", ->
        hsl = ROT.Color.rgb2hsl [128, 128, 128]
        hsl[0].should.equal 0
        hsl[1].should.equal 0
        hsl[2].should.be.within 0.50, 0.51

      it "should return HSL for really red colors", ->
        hsl = ROT.Color.rgb2hsl [234, 13, 27]
        hsl[0].should.be.within 0.98, 0.99
        hsl[1].should.be.within 0.89, 0.90
        hsl[2].should.be.within 0.48, 0.49

      it "should return HSL for really green colors", ->
        hsl = ROT.Color.rgb2hsl [13, 234, 27]
        hsl[0].should.be.within 0.34, 0.35
        hsl[1].should.be.within 0.89, 0.90
        hsl[2].should.be.within 0.48, 0.49

      it "should return HSL for really blue colors", ->
        hsl = ROT.Color.rgb2hsl [27, 13, 234]
        hsl[0].should.be.within 0.67, 0.68
        hsl[1].should.be.within 0.89, 0.90
        hsl[2].should.be.within 0.48, 0.49

      it "should return HSL for dark colors", ->
        hsl = ROT.Color.rgb2hsl [16, 32, 48]
        hsl[0].should.be.within 0.58, 0.59
        hsl[1].should.be.within 0.49, 0.51
        hsl[2].should.be.within 0.12, 0.13

      it "should return HSL for bright colors", ->
        hsl = ROT.Color.rgb2hsl [216, 232, 248]
        hsl[0].should.be.within 0.58, 0.59
        hsl[1].should.be.within 0.69, 0.70
        hsl[2].should.be.within 0.90, 0.91

      it "should return HSL for bright yellow", ->
        hsl = ROT.Color.rgb2hsl [255, 255, 0]
        hsl[0].should.be.within 0.16, 0.17
        hsl[1].should.be.within 0.99, 1.01
        hsl[2].should.be.within 0.49, 0.51

    describe "hsl2rgb", ->
      it "should round-trip to rgb2hsl", ->
        for r in [0..255] by 16
          for g in [0..255] by 16
            for b in [0..255] by 16
              hsl = ROT.Color.rgb2hsl [r,g,b]
              rgb = ROT.Color.hsl2rgb [hsl[0], hsl[1], hsl[2]]
              rgb[0].should.equal r
              rgb[1].should.equal g
              rgb[2].should.equal b

    describe "interpolateHSL", ->
      it "should interpolate between two colors", ->
        a = [135, 206, 235] # skyblue
        b = [ 34, 139,  34] # forestgreen
        color = ROT.Color.interpolateHSL a, b
        color.should.eql [57, 215, 159]
        a.should.eql [135, 206, 235]
        b.should.eql [ 34, 139,  34]

      it "should interpolate between two colors by percentage", ->
        a = [135, 206, 235] # skyblue
        b = [ 34, 139,  34] # forestgreen
        color = ROT.Color.interpolateHSL a, b, 0.75
        color.should.eql [41, 182, 86]
        a.should.eql [135, 206, 235]
        b.should.eql [ 34, 139,  34]

    describe "randomize", ->
      it "should give us some random colors", ->
        color = ROT.Color.randomize [100, 128, 230], [30, 10, 20]
        color.should.be.ok
        color.length.should.equal 3

      it "should give us some random colors with one stddev", ->
        color = ROT.Color.randomize [100, 128, 230], 10
        color.should.be.ok
        color.length.should.equal 3

    describe "_clamp", ->
      it "should bring negative numbers up to 0", ->
        ROT.Color._clamp(-500).should.equal 0
        ROT.Color._clamp(-50).should.equal 0
        ROT.Color._clamp(-5).should.equal 0

      it "should bring positive numbers down to 255", ->
        ROT.Color._clamp(256).should.equal 255
        ROT.Color._clamp(2560).should.equal 255
        ROT.Color._clamp(25600).should.equal 255

      it "should leave 0 to 255 alone", ->
        for i in [0..255]
          ROT.Color._clamp(i).should.equal i

    describe "toRGB", ->
      it "should clamp colors in rgb(rrr,ggg,bbb) form", ->
        rgb = ROT.Color.toRGB [-5, 270, 99]
        rgb.should.equal "rgb(0,255,99)"

    describe "toHex", ->
      it "should clamp colors in #rrggbb form", ->
        hex = ROT.Color.toHex [-5, 270, 99]
        hex.should.equal "#00ff63"

#----------------------------------------------------------------------------
# end of colorTest.coffee
