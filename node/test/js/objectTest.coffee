# objectTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'object', ->
  it 'should use the Object.create built into Node.js', ->
    Object.should.have.property 'create'

#----------------------------------------------------------------------------
# end of objectTest.coffee
