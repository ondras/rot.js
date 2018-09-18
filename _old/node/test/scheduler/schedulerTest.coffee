# schedulerTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../../lib/rot"

describe "scheduler", ->
  it "should export ROT.Scheduler", ->
    ROT.should.have.property "Scheduler"
    
  it "should be possible to create a Scheduler", ->
    scheduler = new ROT.Scheduler()
    scheduler.should.be.ok
  
  describe "Scheduler", ->
    scheduler = null
    
    beforeEach ->
      scheduler = new ROT.Scheduler()
      scheduler.should.be.ok

    describe "Scheduler", ->
      it "should initialize some properties", ->
        scheduler.should.have.properties ["_queue", "_repeat", "_current"]

    describe "getTime", ->
      it "should provide the time of the backing queue", (done) ->
        scheduler._queue.getTime = -> done()
        scheduler.getTime()

    describe "add", ->
      it "should not add ad-hoc items to the repeat list", ->
        scheduler.add "One Time Event", false
        scheduler._repeat.length.should.equal 0

      it "should add repeat items to the repeat list", ->
        scheduler.add "Repeating Event", true
        scheduler._repeat.length.should.equal 1

    describe "clear", ->
      it "should call the clear method of the backing queue", (done) ->
        scheduler._queue.clear = -> done()
        scheduler.clear()

      it "should remove all items from the repeat list", ->
        scheduler.add "Repeating Event 1", true
        scheduler.add "Repeating Event 2", true
        scheduler.add "Repeating Event 3", true
        scheduler._repeat.length.should.equal 3
        scheduler.clear()
        scheduler._repeat.length.should.equal 0

    describe "remove", ->
      it "should remove the item from the backing queue", (done) ->
        scheduler._queue.remove = -> done()
        scheduler.remove "Item 1"

      it "should remove the item from the repeat list", ->
        scheduler.add "Repeating Event 1", true
        scheduler.add "Repeating Event 2", true
        scheduler.add "Repeating Event 3", true
        scheduler._repeat.length.should.equal 3
        scheduler.remove "Repeating Event 2"
        scheduler._repeat.length.should.equal 2

      it "should clear the current item", ->
        scheduler._current = "Repeating Event 1"
        scheduler.remove "Repeating Event 1"
        should(scheduler._current).equal null

    describe "remove", ->
      it "should get the next item from the backing queue", (done) ->
        scheduler._queue.get = -> done()
        scheduler.next()

#----------------------------------------------------------------------------
# end of schedulerTest.coffee
