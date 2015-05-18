# mapTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'map', ->
  it 'should export ROT.Map', ->
    ROT.should.have.property 'Map'

  it 'should be possible to create a Map object', ->
    map = new ROT.Map()
    map.should.be.ok
    
  describe 'Map', ->
    describe 'Map', ->
      it "should use default size if not provided", ->
        map = new ROT.Map()
        map._width.should.equal ROT.DEFAULT_WIDTH
        map._height.should.equal ROT.DEFAULT_HEIGHT

      it "should use size if provided", ->
        map = new ROT.Map 42, 69
        map._width.should.equal 42
        map._height.should.equal 69

    describe 'create', ->
      it "should do nothing", ->
        map = new ROT.Map()
        map.create()

    describe '_fillMap', ->
      it "should return a row-major two-dimensional array of the map", ->
        map = new ROT.Map 5, 7
        array = map._fillMap "X"
        array.length.should.equal 5
        array[0].length.should.equal 7
        array[0][0].should.equal "X"

#----------------------------------------------------------------------------
# end of mapTest.coffee
