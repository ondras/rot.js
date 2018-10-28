# stringTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
ROT = require '../../lib/rot'

describe 'string', ->
  it 'should extend the String prototype', ->
    "".should.have.properties ['capitalize', 'lpad', 'rpad', 'format']
    
  it 'should capitalize a provided string', ->
    "patrick".capitalize().should.equal 'Patrick'

  it 'should left-pad a provided string', ->
    "ea".lpad('0', 4).should.equal '00ea'

  it 'should left-pad a provided string with spaces', ->
    "$1,000".lpad(' ', 10).should.equal '    $1,000'
    
  it 'should left-pad a provided number', ->
    "5".lpad().should.equal '05'

  it 'should right-pad a provided string', ->
    "Long Sword +1".rpad(' ', 20).should.equal 'Long Sword +1       '

  it 'should right-pad a provided number', ->
    "5".rpad().should.equal '50'

  describe 'format', ->
    it 'should format strings with provided arguments', ->
      String.format("Hello, %s!", 'Patrick').should.equal 'Hello, Patrick!'

    it 'should provide a convenience shortcut for formatting strings', ->
      "Hello, %s!".format('Patrick').should.equal 'Hello, Patrick!'

    it 'should not format if not provided with arguments', ->
      'Hello, %s!'.format().should.equal 'Hello, %s!'

    it 'should not format if an unknown replacement is specified', ->
      'Gallons of Fuel: %d'.format(20).should.equal 'Gallons of Fuel: %d'

    it 'should allow a custom replacement mapping', ->
      String.format.map['u'] = 'toUpperCase'
      "Hello, %u!".format('Patrick').should.equal 'Hello, PATRICK!'

    it 'should allow replacement specifiers inside brackets', ->
      "Hello, %{s}!".format('Patrick').should.equal 'Hello, Patrick!'

    it 'should allow replacement specifiers inside brackets', ->
      String.format.map['u'] = 'toUpperCase'
      "Hello, %{u}!".format('Patrick').should.equal 'Hello, PATRICK!'

    it 'should capitalize when replacement specifiers inside brackets are capitalized', ->
      String.format.map['namecase'] = 'toLowerCase'
      "Hello, %{NameCase}!".format('PATRICK').should.equal 'Hello, Patrick!'

    it 'should escape %% as %', ->
      "Hello, %%s!".format('Patrick').should.equal 'Hello, %s!'

#----------------------------------------------------------------------------
# end of stringTest.coffee
