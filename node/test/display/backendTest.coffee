# backendTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'backend', ->
  it 'should export ROT.Display.Backend', ->
    ROT.should.have.property 'Display'
    ROT.Display.should.have.property 'Backend'

  it 'should be possible to create a Backend object', ->
    backend = new ROT.Display.Backend()
    backend.should.be.ok
    
  describe 'Backend', ->
    it 'should cache a reference to the provided context', ->
      MOCK_context = document.createElement("canvas").getContext("2d")
      backend = new ROT.Display.Backend MOCK_context
      backend._context.should.equal MOCK_context

    it 'should have some no-op function properties', ->
      MOCK_context = document.createElement("canvas").getContext("2d")
      backend = new ROT.Display.Backend MOCK_context
      backend.should.have.properties [ "compute", "computeFontSize",
        "computeSize", "draw", "eventToPosition" ]
      backend.compute()
      backend.computeFontSize()
      backend.computeSize()
      backend.draw()
      backend.eventToPosition()

#----------------------------------------------------------------------------
# end of backendTest.coffee
