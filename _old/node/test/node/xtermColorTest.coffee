# xtermColorTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../../lib/rot"

describe "xterm-color", ->
  it "should export ROT.Display.Term.Xterm", ->
    ROT.should.have.property "Display"
    ROT.Display.should.have.property "Term"
    ROT.Display.Term.should.have.property "Xterm"

  it "should be possible to create an Xterm object", ->
    term = new ROT.Display.Term.Xterm()
    term.should.be.ok

  describe "Xterm", ->
    it "should extend ROT.Display.Term.Xterm", ->
      xterm = new ROT.Display.Term.Xterm()
      xterm.should.be.an.instanceof ROT.Display.Term.Xterm
      xterm.should.be.an.instanceof ROT.Display.Term.Xterm
  
    describe "Xterm", ->
      it "should cache the provided context", ->
        context = {}
        xterm = new ROT.Display.Term.Xterm context
        xterm._context.should.equal context

    describe "clearToAnsi", ->
      it "should clear the terminal with the specified color", ->
        context = {}
        xterm = new ROT.Display.Term.Xterm context
        xterm.clearToAnsi("#000").should.equal "\u001b[0;48;5;16m\u001b[2J"

    describe "colorToAnsi", ->
      it "should modify the foreground and background color of the terminal", ->
        context = {}
        xterm = new ROT.Display.Term.Xterm context
        xterm.colorToAnsi("#fff", "#000").should.equal "\u001b[0;38;5;231;48;5;16m"

    describe "positionToAnsi", ->
      it "should reposition the cursor on the terminal", ->
        context = {}
        xterm = new ROT.Display.Term.Xterm context
        xterm.positionToAnsi(13, 19).should.equal "\u001b[20;14H"

#----------------------------------------------------------------------------
# end of xtermColorTest.coffee
