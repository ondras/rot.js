# schedulerActionTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../../lib/rot"

NO_REPEAT = false
YES_REPEAT = true

DEFAULT_DURATION = 42

describe "scheduler", ->
  it "should export ROT.Scheduler.Action", ->
    ROT.should.have.property "Scheduler"
    ROT.Scheduler.should.have.property "Action"
    
  it "should be possible to create a Action", ->
    action = new ROT.Scheduler.Action()
    action.should.be.ok
  
  describe "Action", ->
    action = null
    
    beforeEach ->
      action = new ROT.Scheduler.Action()
      action.should.be.ok

    it "should extend Scheduler", ->
      action.should.be.an.instanceof ROT.Scheduler
      action.should.be.an.instanceof ROT.Scheduler.Action

    describe "add", ->
      it "should add the event to the queue with a default time", (done) ->
        action._defaultDuration = DEFAULT_DURATION
        action._queue.add = (item, time) ->
          done() if time is DEFAULT_DURATION
        action.add "Event 1", NO_REPEAT

      it "should add the event to the queue with a specified time", (done) ->
        action._defaultDuration = DEFAULT_DURATION
        action._queue.add = (item, time) ->
          done() if time is 69
        action.add "Event 1", NO_REPEAT, 69

    describe "clear", ->
      it "should clear the last duration", ->
        action._defaultDuration = DEFAULT_DURATION
        action.setDuration 69
        action.clear()
        action._duration.should.equal DEFAULT_DURATION

    describe "remove", ->
      it "should clear the duration when removing the current item", ->
        action._defaultDuration = DEFAULT_DURATION
        action.add "Old Faithful", YES_REPEAT, 100
        event = action.next()
        event.should.equal "Old Faithful"
        action.setDuration 100
        event = action.next()
        event.should.equal "Old Faithful"
        action.setDuration 100
        action._duration.should.equal 100
        action.remove "Old Faithful"
        action._duration.should.equal DEFAULT_DURATION

      it "should not clear the duration when not removing the current item", ->
        action._defaultDuration = DEFAULT_DURATION
        action.add "Old Faithful", YES_REPEAT, 100
        action.add "New Unreliable", YES_REPEAT, 100
        event = action.next()
        event.should.equal "Old Faithful"
        action.setDuration 100
        event = action.next()
        event.should.equal "New Unreliable"
        action.setDuration 100
        action._duration.should.equal 100
        action.remove "Old Faithful"
        action._duration.should.equal 100

    describe "next", ->
      it "should use the default duration if given a bad duration", ->
        action._defaultDuration = DEFAULT_DURATION
        action.add "Old Faithful", YES_REPEAT, 100
        event = action.next()
        event.should.equal "Old Faithful"
        action.setDuration null
        event = action.next()
        action._duration.should.equal DEFAULT_DURATION
        event.should.equal "Old Faithful"
        action.setDuration 100
        action._duration.should.equal 100
        action.remove "Old Faithful"
        action._duration.should.equal DEFAULT_DURATION

#----------------------------------------------------------------------------
# end of schedulerActionTest.coffee
