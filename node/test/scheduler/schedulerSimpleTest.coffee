# schedulerSimpleTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

describe "scheduler", ->
  it "should export ROT.Scheduler.Simple", ->
    ROT.should.have.property "Scheduler"
    ROT.Scheduler.should.have.property "Simple"
    
  it "should be possible to create a Simple", ->
    simple = new ROT.Scheduler.Simple()
    simple.should.be.ok
  
  describe "Simple", ->
    simple = null
    
    beforeEach ->
      simple = new ROT.Scheduler.Simple()
      simple.should.be.ok

    it "should extend Scheduler", ->
      simple.should.be.an.instanceof ROT.Scheduler
      simple.should.be.an.instanceof ROT.Scheduler.Simple

    describe "add", ->
      it "should add the item to the backing queue", (done) ->
        simple._queue.add = -> done()
        simple.add "Non-Repeating Event", false

    describe "next", ->
      it "should return the next item from the backing queue", ->
        simple.add "Non-Repeating Event", false
        event = simple.next()
        event.should.equal "Non-Repeating Event"

      it "should return repeating events to the queue", (done) ->
        almostDone = _.after 2, done
        simple.add "Repeating Event 1", true
        simple.add "Repeating Event 2", true
        simple._queue.add = -> almostDone()
        event = simple.next()
        event.should.equal "Repeating Event 1"
        event = simple.next()
        event.should.equal "Repeating Event 2"
        simple.next()

#----------------------------------------------------------------------------
# end of schedulerSimpleTest.coffee
