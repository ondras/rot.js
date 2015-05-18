# arrayTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

NUM_RANDOM_CALLS = 100

describe 'array', ->
  it 'should have added methods to the Array prototype', ->
    [].should.have.properties ['random', 'randomize']

  describe 'random', ->
    it 'should return null when the array is empty', ->
      should([].random()).equal null

    it 'should return a random element from the array', ->
      names = [ 'Alice', 'Bob', 'Carol', 'Dave' ]
      for i in [1..NUM_RANDOM_CALLS]
        randomName = names.random()
        (randomName in names).should.equal true

  describe 'randomize', ->
    it 'should return an empty array if provided an empty array', ->
      ([].randomize()).should.eql []

    it 'should return an randomized array when provided with an array', ->
      names = [ 'Alice', 'Bob', 'Carol', 'Dave' ]
      numNames = names.length
      randomizedNames = names.randomize()
      randomizedNames.length.should.equal numNames
      names.length.should.equal 0

#----------------------------------------------------------------------------
# end of arrayTest.coffee
