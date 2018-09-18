# rafTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'raf', ->
  it 'should provide a global requestAnimationFrame method', ->
    global.should.have.property 'requestAnimationFrame'
    
  xit 'should provide a global cancelAnimationFrame method', ->
    global.should.have.property 'cancelAnimationFrame'
    
  it 'should call the provided callback', (done) ->
    global.requestAnimationFrame ->
      done()
    
  xit 'should cancel the provided callback', ->
    requestId = global.requestAnimationFrame -> throw new Error "BAD!"
    global.cancelAnimationFrame requestId

#----------------------------------------------------------------------------
# end of rafTest.coffee
