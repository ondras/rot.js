# rectTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'rect', ->
  it 'should export ROT.Display.Rect', ->
    ROT.should.have.property 'Display'
    ROT.Display.should.have.property 'Rect'

  it 'should be possible to create a Rect object', ->
    rect = new ROT.Display.Rect()
    rect.should.be.ok
    
  describe 'Rect', ->
    it 'should cache a reference to the provided context', ->
      MOCK_context = document.createElement("canvas").getContext("2d")
      rect = new ROT.Display.Rect MOCK_context
      rect._context.should.equal MOCK_context

    describe 'draw', ->
      OLD_cache = ROT.Display.Rect.cache

      afterEach ->
        ROT.Display.Rect.cache = OLD_cache

      it 'should draw without a cache, if configured', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        rect = new ROT.Display.Rect MOCK_context
        ROT.Display.Rect.cache = false
        rect._drawNoCache = -> done()
        rect.draw [ 6, 5, 'a', '#ccc', '#000' ]

      it 'should draw using the cache, if configured', (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        rect = new ROT.Display.Rect MOCK_context
        ROT.Display.Rect.cache = true
        rect._drawWithCache = -> done()
        rect.draw [ 6, 5, 'a', '#ccc', '#000' ]

    describe '_drawWithCache', ->
      it 'should cache the things being drawn', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        rect = new ROT.Display.Rect MOCK_context
        should(rect._canvasCache["a#ccc#000"]).equal undefined
        rect._drawWithCache [ 6, 5, 'a', '#ccc', '#000' ]
        rect._canvasCache["a#ccc#000"].should.be.ok

      it 'should re-use cached things when drawing', (done) ->
        CACHED = {}
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.drawImage = (canvas) -> done() if canvas is CACHED
        rect = new ROT.Display.Rect MOCK_context
        rect._canvasCache["a#ccc#000"] = CACHED
        rect._drawWithCache [ 6, 5, 'a', '#ccc', '#000' ]

      it 'should cache even if a character is not provided', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        rect = new ROT.Display.Rect MOCK_context
        should(rect._canvasCache["undefined#ccc#000"]).equal undefined
        rect._drawWithCache [ 6, 5, undefined, '#ccc', '#000' ]
        rect._canvasCache["undefined#ccc#000"].should.be.ok

    describe '_drawNoCache', ->
      oldRectCache = ROT.Display.Rect.cache
      
      beforeEach ->
        ROT.Display.Rect.cache = false

      afterEach ->
        ROT.Display.Rect.cache = oldRectCache

      it "should call fillRect if clearBefore is set", (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.fillRect = -> done()
        rect = new ROT.Display.Rect MOCK_context
        rect._drawNoCache [ 6, 5, '@', '#fff', '#000' ], true

      it "should return if no character is provided", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.fillText = -> throw new Error "AWWW HELL NO!"
        rect = new ROT.Display.Rect MOCK_context
        rect._drawNoCache [ 6, 5, undefined, '#fff', '#000' ], false

      it "should call fillText if a character is provided", (done) ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.fillRect = ->
        MOCK_context.fillText = -> done()
        rect = new ROT.Display.Rect MOCK_context
        rect._drawNoCache [ 6, 5, '@', '#fff', '#000' ], true

    describe 'computeSize', ->
      it 'should compute width as availWidth / x-spacing', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 5
        rect = new ROT.Display.Rect MOCK_context
        rect.compute options =
          spacing: 2
        [width, height] = rect.computeSize 700, 500
        width.should.equal 70

      it 'should compute height as availHeight / y-spacing', ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        rect = new ROT.Display.Rect MOCK_context
        rect.compute options =
          fontSize: 5
          spacing: 2
        [width, height] = rect.computeSize 700, 500
        height.should.equal 50

    describe 'computeFontSize', ->
      it "should compute fontSize from physical size / display size", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        rect = new ROT.Display.Rect MOCK_context
        rect.compute options =
          width: 70
          height: 50
          spacing: 1
        fontSize = rect.computeFontSize 700, 500
        fontSize.should.equal 10

      it "should not let skewed aspect ratios mess things up", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 110
        rect = new ROT.Display.Rect MOCK_context
        rect.compute options =
          width: 70
          height: 50
          spacing: 1
        fontSize = rect.computeFontSize 700, 500
        fontSize.should.equal 9

      it "should allow a square aspect ratio to be forced", ->
        MOCK_context = document.createElement("canvas").getContext("2d")
        MOCK_context.measureText = ->
          result =
            width: 110
        rect = new ROT.Display.Rect MOCK_context
        rect.compute options =
          width: 70
          height: 50
          spacing: 1
          forceSquareRatio: true
        fontSize = rect.computeFontSize 700, 500
        fontSize.should.equal 9

#----------------------------------------------------------------------------
# end of rectTest.coffee
