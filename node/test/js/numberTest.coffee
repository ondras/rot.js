# numberTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'number', ->
  it 'should have added methods to the Number prototype', ->
    (15).should.have.property 'mod'

  describe 'mod', ->
    it 'should return a positive result on (pos % pos)', ->
      (15).mod(7).should.equal 1

    it 'should return a positive result on (neg % pos)', ->
      (-15).mod(7).should.equal 6

#----------------------------------------------------------------------------
# end of numberTest.coffee
