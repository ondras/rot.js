# rotTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../lib/rot'

describe 'rot', ->
  it 'should export the ROT namespace', ->
    ROT.should.be.ok

  it 'should have an isSupported method', ->
    ROT.should.have.property 'isSupported'

  it 'should be supported on Node.js', ->
    ROT.isSupported().should.equal true

#----------------------------------------------------------------------------
# end of rotTest.coffee
