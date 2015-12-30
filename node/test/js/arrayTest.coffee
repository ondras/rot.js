# arrayTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'array', ->
  it 'should not have added methods to the Array prototype', ->
    [].should.not.have.properties ['random', 'randomize']



#----------------------------------------------------------------------------
# end of arrayTest.coffee
