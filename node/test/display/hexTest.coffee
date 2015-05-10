# hexTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'hex', ->
  it 'should export ROT.Display.Hex', ->
    ROT.should.have.property 'Display'
    ROT.Display.should.have.property 'Hex'

  it 'should be possible to create a Hex object', ->
    hex = new ROT.Display.Hex()
    hex.should.be.ok
    
  describe 'Hex', ->
    it 'should cache a reference to the provided context', ->
      MOCK_context = document.createElement("canvas").getContext("2d")
      hex = new ROT.Display.Hex MOCK_context
      hex._context.should.equal MOCK_context

    describe 'compute', ->
      it "should allow hexes to be transposed", ->
        # compute without transposition
        MOCK_context = document.createElement("canvas").getContext("2d")
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          spacing: 1
          fontSize: 10
          transpose: false
          width: 80
          height: 25
        hex._options.should.equal options
        xprop = hex._context.canvas.width
        yprop = hex._context.canvas.height
        # compute with transposition
        MOCK_context2 = document.createElement("canvas").getContext("2d")
        hex2 = new ROT.Display.Hex MOCK_context2
        hex2.compute options =
          spacing: 1
          fontSize: 10
          transpose: true
          width: 80
          height: 25
        # how do they compare?
        hex2._context.canvas.width.should.equal yprop
        hex2._context.canvas.height.should.equal xprop

    describe 'draw', ->
      it 'should clear the hex if asked to do so', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        hex = new ROT.Display.Hex MOCK_context
        hex._fill = -> done()
        hex.draw [ 3, 5, 'a', '#ccc', '#000' ], true

      it 'should transpose the hex if asked to do so', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          spacing: 1
          fontSize: 10
          transpose: true
          width: 80
          height: 25
        hex.draw [ 3, 5, 'a', '#ccc', '#000' ], true

      it 'should not draw a character if none is provided', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.fillText = -> should.fail()
        hex = new ROT.Display.Hex MOCK_context
        hex.draw [ 3, 5, undefined, '#ccc', '#000' ]

    describe 'computeSize', ->
      it "should compute width and height for available size and spacing", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 5
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          spacing: 2
          fontSize: 5
          transpose: false
        [width, height] = hex.computeSize 800, 250
        width.should.equal 130
        height.should.equal 23

      it "should compute width and height for transposed hexes", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 5
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          spacing: 2
          fontSize: 5
          transpose: true
        [width, height] = hex.computeSize 800, 250
        width.should.equal 40
        height.should.equal 75

    describe 'computeFontSize', ->
      it "should compute fontSize from physical size / display size", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 10
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          spacing: 2
          width: 80
          height: 25
          transpose: false
        fontSize = hex.computeFontSize 800, 250
        fontSize.should.equal 6

      it "should compute fontSize for transposed hexes", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 10
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          spacing: 1
          width: 80
          height: 25
          transpose: true
        fontSize = hex.computeFontSize 800, 250
        fontSize.should.equal 5

    describe 'eventToPosition', ->
      it "should compute the hex for a given event", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.canvas.width = 800
        MOCK_context.canvas.height = 250
        MOCK_context.measureText = ->
          result =
            width: 10
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          fontSize: 10
          spacing: 1
          width: 80
          height: 25
          transpose: false
        [x,y] = hex.eventToPosition 400, 125
        x.should.equal 65
        y.should.equal 11

      it "should compute the hex for an event on an odd row", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.canvas.width = 800
        MOCK_context.canvas.height = 250
        MOCK_context.measureText = ->
          result =
            width: 10
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          fontSize: 10
          spacing: 1
          width: 80
          height: 25
          transpose: false
        [x,y] = hex.eventToPosition 400, 130
        x.should.equal 64
        y.should.equal 12

      it "should compute the transposed hex for a given event", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.canvas.width = 800
        MOCK_context.canvas.height = 250
        MOCK_context.measureText = ->
          result =
            width: 10
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          fontSize: 10
          spacing: 1
          width: 80
          height: 25
          transpose: true
        [x,y] = hex.eventToPosition 400, 125
        x.should.equal 20
        y.should.equal 120

    describe '_fill', ->
      it "should fill non-transposed hexes", (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.canvas.width = 800
        MOCK_context.canvas.height = 250
        MOCK_context.fill = -> done()
        MOCK_context.measureText = ->
          result =
            width: 10
        hex = new ROT.Display.Hex MOCK_context
        hex.compute options =
          fontSize: 10
          spacing: 1
          width: 80
          height: 25
          transpose: false
        hex._fill 2, 2

#----------------------------------------------------------------------------
# end of hexTest.coffee
