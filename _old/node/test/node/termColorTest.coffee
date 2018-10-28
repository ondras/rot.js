# termColorTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../../lib/rot"

describe "term-color", ->
  it "should export ROT.Display.Term.Color", ->
    ROT.should.have.property "Display"
    ROT.Display.should.have.property "Term"
    ROT.Display.Term.should.have.property "Color"

  it "should be possible to create a Color object", ->
    term = new ROT.Display.Term.Color()
    term.should.be.ok

  describe "Color", ->
    describe "Color", ->
      it "should cache the provided context", ->
        context = {}
        color = new ROT.Display.Term.Color context
        color._context.should.equal context

    describe "clearToAnsi", ->
      it "should do nothing", ->
        context = {}
        color = new ROT.Display.Term.Color context
        color.clearToAnsi()

    describe "colorToAnsi", ->
      it "should do nothing", ->
        context = {}
        color = new ROT.Display.Term.Color context
        color.colorToAnsi()

    describe "positionToAnsi", ->
      it "should do nothing", ->
        context = {}
        color = new ROT.Display.Term.Color context
        color.positionToAnsi()

#----------------------------------------------------------------------------
# end of termColorTest.coffee
