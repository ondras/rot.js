# schedulerSpeedTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

NO_REPEAT = false
YES_REPEAT = true

describe "scheduler", ->
  it "should export ROT.Scheduler.Speed", ->
    ROT.should.have.property "Scheduler"
    ROT.Scheduler.should.have.property "Speed"
    
  it "should be possible to create a Speed", ->
    speed = new ROT.Scheduler.Speed()
    speed.should.be.ok
  
  describe "Speed", ->
    speed = null
    
    beforeEach ->
      speed = new ROT.Scheduler.Speed()
      speed.should.be.ok

    it "should extend Scheduler", ->
      speed.should.be.an.instanceof ROT.Scheduler
      speed.should.be.an.instanceof ROT.Scheduler.Speed

    describe "add", ->
      it "should call the getSpeed method on added events", (done) ->
        MOCK_event =
          getSpeed: ->
            done()
            return 50
        speed.add MOCK_event, NO_REPEAT

      it "should add the item to the backing queue", (done) ->
        MOCK_event =
          getSpeed: -> 50
        speed._queue.add = -> done()
        speed.add MOCK_event, NO_REPEAT

    describe "next", ->
      it "should return the next item from the backing queue", ->
        MOCK_event =
          getSpeed: -> 50
        speed.add MOCK_event, NO_REPEAT
        event = speed.next()
        event.should.equal MOCK_event

      it "should return repeating events to the queue", (done) ->
        MOCK_event1 =
          getSpeed: -> 50
        MOCK_event2 =
          getSpeed: -> 50
        almostDone = _.after 2, done
        speed.add MOCK_event1, YES_REPEAT
        speed.add MOCK_event2, YES_REPEAT
        speed._queue.add = -> almostDone()
        event = speed.next()
        event.should.equal MOCK_event1
        event = speed.next()
        event.should.equal MOCK_event2
        speed.next()

      it "should respect the speed of the actors", ->
        littleMac =
          name: "Mac"
          getSpeed: -> 100
        glassJoe = 
          name: "Joe"
          getSpeed: -> 25
        speed.add littleMac, YES_REPEAT
        speed.add glassJoe, YES_REPEAT
        speed.next().should.eql littleMac
        speed.next().should.eql littleMac
        speed.next().should.eql littleMac
        speed.next().should.eql glassJoe
        for i in [0..100]
          speed.next().should.eql littleMac
          speed.next().should.eql littleMac
          speed.next().should.eql littleMac
          speed.next().should.eql littleMac
          speed.next().should.eql glassJoe

#----------------------------------------------------------------------------
# end of schedulerSpeedTest.coffee
