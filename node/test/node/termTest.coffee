# termTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../../lib/rot"

describe "term", ->
  it "should export ROT.Display.Term", ->
    ROT.should.have.property "Display"
    ROT.Display.should.have.property "Term"

  it "should be possible to create a Term object", ->
    term = new ROT.Display.Term()
    term.should.be.ok

  describe "Term", ->
    TERM_WIDTH = 80
    TERM_HEIGHT = 25
    
    oldColumns = process.stdout.columns
    oldRows = process.stdout.rows
    
    beforeEach ->
      process.stdout.columns = TERM_WIDTH
      process.stdout.rows = TERM_HEIGHT

    afterEach ->
      process.stdout.columns = oldColumns
      process.stdout.rows = oldRows

    it "should extend ROT.Display.Backend", ->
      term = new ROT.Display.Term()
      term.should.be.an.instanceof ROT.Display.Backend
      term.should.be.an.instanceof ROT.Display.Term

    describe "compute", ->
      it "should cache the provided options", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term._options.should.equal options

    describe "draw", ->
      it "should draw at the appropriate location", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, 5, "@", "#fff", "#000"]

      it "should bail if off the left side", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [-2, 5, "@", "#fff", "#000"]

      it "should bail if off the right side", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [(TERM_WIDTH + 2), 5, "@", "#fff", "#000"]

      it "should bail if off the top side", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, -5, "@", "#fff", "#000"]

      it "should bail if off the bottom side", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, (TERM_HEIGHT + 5), "@", "#fff", "#000"]

      it "should not move the cursor if it doesn't need to", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, 5, "@", "#fff", "#000"]
        term.draw [6, 5, "@", "#fff", "#000"]

      it "should provide a space if we're clearing", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, 5, undefined, "#fff", "#000"], true

      it "should use a character when clearing, if provided", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, 5, "#", "#fff", "#000"], true

      it "should bail if not provided with a character and not clearing", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [5, 5, undefined, "#fff", "#000"], false

      it "should wrap to the next line, if needed", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.draw [79, 5, "@", "#fff", "#000"], true
        term._cx.should.equal 0
        term._cy.should.equal 6

    describe "computeSize", ->
      it "should wrap to the next line, if needed", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        [width, height] = term.computeSize()
        width.should.equal TERM_WIDTH
        height.should.equal TERM_HEIGHT

    describe "computeFontSize", ->
      it "should always return 12", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.computeFontSize().should.equal 12

    describe "eventToPosition", ->
      it "should always return what it was given", ->
        context = {}
        options =
          width: TERM_WIDTH
          height: TERM_HEIGHT
          termColor: "xterm"
        term = new ROT.Display.Term context
        term.compute options
        term.eventToPosition(13,19).should.eql [13, 19]

#----------------------------------------------------------------------------
# end of termTest.coffee
