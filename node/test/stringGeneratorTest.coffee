# stringGeneratorTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../lib/rot"

describe "stringgenerator", ->
  it "should export ROT.StringGenerator", ->
    ROT.should.have.property "StringGenerator"
    
  it "should be possible to create a StringGenerator", ->
    stringGenerator = new ROT.StringGenerator MOCK_options =
      words: false
  		order: 3
  		prior: 0.001
    stringGenerator.should.be.ok
  
  describe "StringGenerator", ->
    describe "observe", ->
      it "should build a model based on observations of test data", ->
        stringGenerator = new ROT.StringGenerator MOCK_options =
          words: false
          order: 3
          prior: 0.0001
        stringGenerator._data.should.eql {}
        stringGenerator._priorValues.should.eql { '\u0000': 0.0001 }
        letters = "abcdefghijklmnopqrstuvwxyz".split ''
        for i in [1..100]
          rndWord = (letters.random() for i in [1..(Math.floor Math.random()*10)+3]).join ''
          stringGenerator.observe rndWord
        stringGenerator._data.should.not.eql {}
        stringGenerator._priorValues.should.not.eql {}

    describe "clear", ->
      it "should clear the model of previous observations of test data", ->
        stringGenerator = new ROT.StringGenerator MOCK_options =
          words: true
          order: 3
          prior: 0.0001
        stringGenerator._data.should.eql {}
        stringGenerator._priorValues.should.eql { '\u0000': 0.0001 }
        letters = "abcdefghijklmnopqrstuvwxyz     ".split ''
        for i in [1..100]
          rndWord = (letters.random() for i in [1..(Math.floor Math.random()*10)+3]).join ''
          stringGenerator.observe rndWord
        stringGenerator._data.should.not.eql {}
        stringGenerator._priorValues.should.not.eql {}
        stringGenerator.clear()
        stringGenerator._data.should.eql {}
        stringGenerator._priorValues.should.eql {}

    describe "generate", ->
      it "should generate words from the observed model", ->
        stringGenerator = new ROT.StringGenerator MOCK_options =
          words: false
          order: 3
          prior: 0.0001
        stringGenerator._data.should.eql {}
        stringGenerator._priorValues.should.eql { '\u0000': 0.0001 }
        letters = "abcdefghijklmnopqrstuvwxyz".split ''
        for i in [1..100]
          rndWord = (letters.random() for i in [1..(Math.floor Math.random()*10)+3]).join ''
          stringGenerator.observe rndWord
        stringGenerator._data.should.not.eql {}
        stringGenerator._priorValues.should.not.eql {}
        for i in [1..100]
          word = stringGenerator.generate()
          word.should.be.a.String

      it "should generate different words without a specified prior", ->
        stringGenerator = new ROT.StringGenerator MOCK_options =
          words: false
          order: 3
          prior: null
        stringGenerator._data.should.eql {}
        stringGenerator._priorValues.should.eql { '\u0000': null }
        letters = "abcdefghijklmnopqrstuvwxyz".split ''
        for i in [1..100]
          rndWord = (letters.random() for i in [1..(Math.floor Math.random()*10)+3]).join ''
          stringGenerator.observe rndWord
        stringGenerator._data.should.not.eql {}
        stringGenerator._priorValues.should.not.eql {}
        for i in [1..100]
          word = stringGenerator.generate()
          word.should.be.a.String

      it "should generate nothing when no observations are made", ->
        stringGenerator = new ROT.StringGenerator MOCK_options =
          words: false
          order: 3
          prior: 0.0001
        for i in [1..100]
          word = stringGenerator.generate()
          word.should.equal ""

    describe "getStats", ->
      it "should generate some statistics for debug purposes", ->
        stringGenerator = new ROT.StringGenerator MOCK_options =
          words: false
          order: 3
          prior: 0.0001
        stringGenerator._data.should.eql {}
        stringGenerator._priorValues.should.eql { '\u0000': 0.0001 }
        letters = "abcdefghijklmnopqrstuvwxyz".split ''
        for i in [1..100]
          rndWord = (letters.random() for i in [1..(Math.floor Math.random()*10)+3]).join ''
          stringGenerator.observe rndWord
        stringGenerator._data.should.not.eql {}
        stringGenerator._priorValues.should.not.eql {}
        stats = stringGenerator.getStats()
        stats.should.be.a.String

#----------------------------------------------------------------------------
# end of stringGeneratorTest.coffee
