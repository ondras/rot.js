# displayTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

oldRAF = global.requestAnimationFrame

describe 'display', ->
  beforeEach ->
    global.requestAnimationFrame = ->
    
  afterEach ->
    global.requestAnimationFrame = oldRAF
    
  it 'should export ROT.Display', ->
    ROT.should.have.property 'Display'

  it 'should be possible to create a Display object', ->
    display = new ROT.Display()
    display.should.be.ok
    
  describe 'Display', ->
    it 'should use provided options', ->
      display = new ROT.Display
        width: 40
        height: 12
        layout: "hex"
      options = display.getOptions()
      options.should.be.ok
      options.should.have.properties ['width', 'height', 'layout']
      options.width.should.equal 40
      options.height.should.equal 12
      options.layout.should.equal "hex"

    it 'should have some useful methods', ->
      display = new ROT.Display()
      display.should.have.properties [ 'DEBUG', 'clear', 'setOptions',
        'getOptions', 'getContainer', 'computeSize', 'computeFontSize',
        'eventToPosition', 'draw', 'drawText' ]

    describe 'DEBUG', ->
      it 'can be used as a map generator callback', ->
        display = new ROT.Display()
        display.DEBUG 5, 5, 0

    describe 'clear', ->
      it 'should clear the display', ->
        display = new ROT.Display()
        display.draw 5,  4, "@"
        display._data.should.not.eql {}
        display.clear()
        display._data.should.eql {}
        display._dirty.should.equal true

    describe 'setOptions', ->
      it 'should do nothing if called with an empty object', ->
        display = new ROT.Display()
        options = display.getOptions()
        display.setOptions {}
        display.getOptions().should.equal options

      it 'should not change the layout if not provided with a new layout', ->
        display = new ROT.Display()
        backend = display._backend
        display.setOptions
          width: 80
          height: 25
        display._backend.should.equal backend

      it 'should use a fontStyle if one is provided in the options', ->
        display = new ROT.Display()
        display._context.font.should.equal '15px monospace'
        display.setOptions
          fontSize: 12
          fontStyle: 'bold'
        display._context.font.should.equal 'bold 12px monospace'

      it 'should NOT use fontStyle if fontSize and/or fontFamily is not provided in the options', ->
        display = new ROT.Display()
        display._context.font.should.equal '15px monospace'
        display.setOptions
          fontStyle: 'bold'
        display._context.font.should.equal '15px monospace'

    describe 'getContainer', ->
      it 'should return a shim <canvas> DOM object', ->
        display = new ROT.Display()
        canvas = display.getContainer()
        canvas.should.be.ok
        shim = document.createElement 'canvas'
        shim.height = 375
        shim.width = 960
        canvas.should.eql shim

    describe 'computeSize', ->
      it 'should call computeSize in the backend', (done) ->
        display = new ROT.Display()
        display._backend =
          computeSize: -> done()
        display.computeSize()

    describe 'computeFontSize', ->
      it 'should call computeFontSize in the backend', (done) ->
        display = new ROT.Display()
        display._backend =
          computeFontSize: -> done()
        display.computeFontSize()

    describe 'eventToPosition', ->
      it 'should call eventToPosition in the backend', (done) ->
        display = new ROT.Display()
        display._backend =
          eventToPosition: -> done()
        display.eventToPosition
          clientX: 20
          clientY: 20

      it 'should use the first touch if provided with touches', ->
        display = new ROT.Display()
        position = display.eventToPosition
          touches: [ {clientX:5*12, clientY:5*15 }, {clientX:10*12, clientY:10*15} ]
          clientX: 15*12
          clientY: 15*15
        position.should.eql [5, 5]

      it 'should return [-1,-1] if off the canvas to the left', ->
        display = new ROT.Display()
        position = display.eventToPosition
          clientX: -5
          clientY: 15*15
        position.should.eql [-1, -1]

      it 'should return [-1,-1] if off the canvas above', ->
        display = new ROT.Display()
        position = display.eventToPosition
          clientX: 15*12
          clientY: -5
        position.should.eql [-1, -1]

      it 'should return [-1,-1] if off the canvas to the right', ->
        display = new ROT.Display()
        position = display.eventToPosition
          clientX: 965
          clientY: 15*15
        position.should.eql [-1, -1]

      it 'should return [-1,-1] if off the canvas below', ->
        display = new ROT.Display()
        position = display.eventToPosition
          clientX: 15*12
          clientY: 380
        position.should.eql [-1, -1]

    describe 'draw', ->
      it 'should use the default fg if a fg is not provided', ->
        display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'})
        display.draw 3, 5, '@', null, '#000'
        display._data["3,5"].should.eql [ 3, 5, '@', '#abc', '#000' ]

      it 'should use the default bg if a bg is not provided', ->
        display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'})
        display.draw 3, 5, '@', '#000', null
        display._data["3,5"].should.eql [ 3, 5, '@', '#000', '#cba' ]

      it 'should create a dirty map if it does not have one', ->
        display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'})
        delete display._dirty
        should(display._dirty).not.be.ok
        display.draw 5, 7, 'X', '#000', '#111'
        display._data["5,7"].should.eql [ 5, 7, 'X', '#000', '#111' ]
        display._dirty.should.be.ok
        display._dirty["5,7"].should.equal true

      it 'should use an existing dirty map if it has one', ->
        display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'})
        display._dirty = {}
        display.draw 5, 7, 'X', '#000', '#111'
        display._data["5,7"].should.eql [ 5, 7, 'X', '#000', '#111' ]
        display._dirty["5,7"].should.equal true

    describe 'drawText', ->
      it 'should return 1 when drawing one line', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "Hello, world!"
        result.should.equal 1

      it 'should return 3 when drawing three lines', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "Robots:\nMega Man\nMetal Man"
        result.should.equal 3

      it 'should change the foreground color with %c{name}', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "%c{#00f}Hello"
        result.should.equal 1
        display._data["3,5"].should.eql [ 3, 5, 'H', '#00f', '#000' ]

      it 'should change the background color with %b{name}', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "%b{#00f}Hello"
        result.should.equal 1
        display._data["3,5"].should.eql [ 3, 5, 'H', '#ccc', '#00f' ]

      it 'should reset the foreground color with %c{}', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "%c{#00f}He%c{}llo"
        result.should.equal 1
        display._data["5,5"].should.eql [ 5, 5, 'l', '#ccc', '#000' ]

      it 'should reset the background color with %b{}', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "%b{#00f}He%b{}llo"
        result.should.equal 1
        display._data["5,5"].should.eql [ 5, 5, 'l', '#ccc', '#000' ]

      it 'should break lines at a specified maximum width', ->
        OUTPUT = 'This is the longest sentence in the English language.'
        display = new ROT.Display()
        result = display.drawText 3, 5, OUTPUT, 10
        # 0123456789
        # This is
        # the           
        # longest
        # sentence
        # in the
        # English
        # language.
        result.should.equal 7

      it 'should add extra spaces for full-width characters', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "ⅧⅧⅧ"
        result.should.equal 1
        display._data["4,5"].should.eql [ 4, 5, 'Ⅷ', '#ccc', '#000' ]
        display._data["6,5"].should.eql [ 6, 5, 'Ⅷ', '#ccc', '#000' ]
        display._data["8,5"].should.eql [ 8, 5, 'Ⅷ', '#ccc', '#000' ]

      it 'should not add extra spaces if the previous character was a space', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "Ⅷ Ⅷ"
        result.should.equal 1
        display._data["4,5"].should.eql [ 4, 5, 'Ⅷ', '#ccc', '#000' ]
        display._data["5,5"].should.eql [ 5, 5, ' ', '#ccc', '#000' ]
        display._data["6,5"].should.eql [ 6, 5, 'Ⅷ', '#ccc', '#000' ]

      it 'should add extra spaces if the previous character was not a space', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "ⅧaⅧ"
        result.should.equal 1
        display._data["4,5"].should.eql [ 4, 5, 'Ⅷ', '#ccc', '#000' ]
        display._data["6,5"].should.eql [ 6, 5, 'a', '#ccc', '#000' ]
        display._data["8,5"].should.eql [ 8, 5, 'Ⅷ', '#ccc', '#000' ]

      it 'a character between 0xffdc and 0xffe8 should not be considered full-width', ->
        display = new ROT.Display()
        result = display.drawText 3, 5, "\uffe0\uffe0\uffe0"
        result.should.equal 1
        display._data["3,5"].should.eql [ 3, 5, '￠', '#ccc', '#000' ]
        display._data["4,5"].should.eql [ 4, 5, '￠', '#ccc', '#000' ]
        display._data["5,5"].should.eql [ 5, 5, '￠', '#ccc', '#000' ]

    describe "_tick", ->
      it 'should call RAF to reschedule itself', (done) ->
        display = new ROT.Display()
        prevRAF = global.requestAnimationFrame
        global.requestAnimationFrame = ->
          done()
          global.requestAnimationFrame = prevRAF
        display._tick()

      it 'should return if nothing is dirty on the display', ->
        display = new ROT.Display()
        display._dirty = false
        display._tick()

      it 'should redraw everything if _dirty is true', (done) ->
        display = new ROT.Display()
        display._data =
          "1,1": [ 1, 1, '@', '#fff', '#000' ]
        display._dirty = true
        display._draw = -> done()
        display._tick()

      it 'should redraw only the _dirty stuff', (done) ->
        display = new ROT.Display()
        display._data =
          "1,1": [ 1, 1, '@', '#fff', '#000' ]
          "2,2": [ 2, 2, '@', '#fff', '#000' ]
          "3,3": [ 3, 3, '@', '#fff', '#000' ]
        display._dirty = 
          "2,2": [ 2, 2, '@', '#fff', '#000' ]
        display._draw = -> done()
        display._tick()

    describe "_draw", ->
      it "should call draw on the backend", (done) ->
        display = new ROT.Display()
        display._backend =
          draw: -> done()
        display._data =
          "1,1": [ 1, 1, '@', '#fff', '#000' ]
          "2,2": [ 2, 2, '@', '#fff', '#000' ]
          "3,3": [ 3, 3, '@', '#fff', '#000' ]
        display._draw "2,2"

      it "should set clearBefore if the background doesn't match", (done) ->
        display = new ROT.Display()
        display._backend =
          draw: (data, clear) -> done() if clear
        display._data =
          "1,1": [ 1, 1, '@', '#fff', '#000' ]
          "2,2": [ 2, 2, '@', '#fff', '#888' ]
          "3,3": [ 3, 3, '@', '#fff', '#000' ]
        display._draw "2,2"

#----------------------------------------------------------------------------
# end of displayTest.coffee
