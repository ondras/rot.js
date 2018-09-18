# tileTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'tile', ->
  it 'should export ROT.Display.Tile', ->
    ROT.should.have.property 'Display'
    ROT.Display.should.have.property 'Tile'

  it 'should be possible to create a Tile object', ->
    tile = new ROT.Display.Tile()
    tile.should.be.ok
    
  describe 'Tile', ->
    it 'should cache a reference to the provided context', ->
      MOCK_context = document.createElement("canvas").getContext("2d")
      tile = new ROT.Display.Tile MOCK_context
      tile._context.should.equal MOCK_context

    describe 'compute', ->
      it 'should cache a reference to the provided options', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          width: 20
          height: 12
        tile._options.should.equal MOCK_options
        tile._context.canvas.width.should.equal 320
        tile._context.canvas.height.should.equal 192
        tile._colorCanvas.width.should.equal 16
        tile._colorCanvas.height.should.equal 16

    describe 'draw', ->
      it "should draw nothing when given nothing", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        tile = new ROT.Display.Tile MOCK_context
        tile.draw [ null, null, null, null, null ], false
        tile._context.fillStyle.should.equal "#000"

      it 'should call clearRect when clearing with tileColorize', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.clearRect = -> done()
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          width: 20
          height: 12
          tileColorize: true
        tile.draw [ null, null, null, null, null ], true

      it 'should call fillRect when clearing without tileColorize', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.fillRect = -> done()
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          width: 20
          height: 12
          tileColorize: false
        tile.draw [ null, null, null, null, null ], true

      it "should throw an error if an unmapped tile is used", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.fillRect = -> done()
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap: {}
          width: 20
          height: 12
        x = 3
        y = 5
        ch = "@"
        fg = "#000"
        bg = "transparent"
        should.throws(-> tile.draw [ x, y, ch, fg, bg ], false)

      it 'should call drawImage when drawing without tileColorize', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.drawImage = -> done()
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap:
            "@": [16,16]
          width: 20
          height: 12
          tileColorize: false
        x = 3
        y = 5
        ch = "@"
        fg = "#000"
        bg = "transparent"
        tile.draw [ x, y, ch, fg, bg ], false

      it 'should call drawImage when drawing with tileColorize', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.drawImage = -> done()
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap:
            "@": [16,16]
          width: 20
          height: 12
          tileColorize: true
        x = 3
        y = 5
        ch = "@"
        fg = "#000"
        bg = "transparent"
        tile.draw [ x, y, ch, fg, bg ], false

      it 'should handle transparent fg as well', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.drawImage = -> done()
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap:
            "@": [16,16]
          width: 20
          height: 12
          tileColorize: true
        x = 3
        y = 5
        ch = "@"
        fg = "transparent"
        bg = "#000"
        tile.draw [ x, y, ch, fg, bg ], false

    describe "computeSize", ->
      it "should compute tile count as physical size / tile size", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap:
            "@": [16,16]
          width: 20
          height: 12
          tileColorize: true
        [width, height] = tile.computeSize 320, 200
        width.should.equal 20
        height.should.equal 12

    describe "computeFontSize", ->
      it "should compute tile size as physical size / tile count", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap:
            "@": [16,16]
          width: 20
          height: 12
          tileColorize: true
        [tileWidth, tileHeight] = tile.computeFontSize 320, 200
        tileWidth.should.equal 16
        tileHeight.should.equal 16

    describe "eventToPosition", ->
      it "should compute logical coordinates from physical ones", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        tile = new ROT.Display.Tile MOCK_context
        tile.compute MOCK_options =
          tileWidth: 16
          tileHeight: 16
          tileMap:
            "@": [16,16]
          width: 20
          height: 12
          tileColorize: true
        [x, y] = tile.eventToPosition 50, 70
        x.should.equal 3
        y.should.equal 4

#----------------------------------------------------------------------------
# end of tileTest.coffee
