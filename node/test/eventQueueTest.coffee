# eventQueueTest.coffee
#----------------------------------------------------------------------------

should = require "should"
ROT = require "../lib/rot"

describe "eventqueue", ->
  it "should export ROT.EventQueue", ->
    ROT.should.have.property "EventQueue"
    
  it "should be possible to create an EventQueue", ->
    eventQueue = new ROT.EventQueue()
    eventQueue.should.be.ok
  
  describe "EventQueue", ->
    eventQueue = null
    
    beforeEach ->
      eventQueue = new ROT.EventQueue()
      eventQueue.should.be.ok

    describe "getTime", ->
      it "should return 0, when no time has passed", ->
        eventQueue.getTime().should.equal 0

    describe "clear", ->
      it "should clear the event queue of all events", ->
        eventQueue.add "Event 1", 10
        eventQueue.add "Event 2", 20
        eventQueue.add "Event 3", 30
        eventQueue.clear()
        should(eventQueue.get()).equal null

    describe "add", ->
      it "should be able to handle events in time-order", ->
        eventQueue.add "Event 1", 10
        eventQueue.add "Event 2", 20
        eventQueue.add "Event 3", 30
        eventQueue.get().should.equal "Event 1"
        eventQueue.get().should.equal "Event 2"
        eventQueue.get().should.equal "Event 3"

      it "should be able to handle events in reverse time-order", ->
        eventQueue.add "Event 3", 30
        eventQueue.add "Event 2", 20
        eventQueue.add "Event 1", 10
        eventQueue.get().should.equal "Event 1"
        eventQueue.get().should.equal "Event 2"
        eventQueue.get().should.equal "Event 3"

    describe "get", ->
      it "should return nothing, when no events are posted", ->
        event = eventQueue.get()
        should(event).equal null

      it "should not advance time when it is not necessary", ->
        eventQueue.add "Event 1", 10
        eventQueue.add "Event 2", 10
        eventQueue.add "Event 3", 10
        eventQueue.get().should.equal "Event 1"
        eventQueue.get().should.equal "Event 2"
        eventQueue.get().should.equal "Event 3"

    describe "remove", ->
      it "should be able to remove events", ->
        eventQueue.add "Event 1", 10
        eventQueue.add "Event 2", 20
        eventQueue.add "Event 3", 30
        eventQueue.remove("Event 2").should.equal true
        eventQueue.get().should.equal "Event 1"
        eventQueue.get().should.equal "Event 3"

      it "should return false if unable to remove the event", ->
        eventQueue.add "Event 1", 10
        eventQueue.add "Event 2", 20
        eventQueue.add "Event 3", 30
        eventQueue.remove("Event 7").should.equal false
        eventQueue.get().should.equal "Event 1"
        eventQueue.get().should.equal "Event 2"
        eventQueue.get().should.equal "Event 3"

#----------------------------------------------------------------------------
# end of eventQueueTest.coffee
