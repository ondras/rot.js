# engineTest.coffee
#----------------------------------------------------------------------------

_ = require "underscore"
should = require "should"
ROT = require "../lib/rot"

describe "engine", ->
  it "should export ROT.Engine", ->
    ROT.should.have.property "Engine"
    
  it "should be possible to create an Engine", ->
    engine = new ROT.Engine()
    engine.should.be.ok
  
  describe "Engine", ->
    describe "Engine", ->
      it "should cache the provided scheduler", ->
        engine = new ROT.Engine myScheduler =
          next: ->
        engine._scheduler.should.equal myScheduler

      it "should lock the engine at construction", ->
        MOCK_actor =
          act: ->
        MOCK_scheduler =
          next: -> MOCK_actor
        engine = new ROT.Engine MOCK_scheduler
        engine._lock.should.be.greaterThan 0

    describe "start", ->
      it "should call the unlock method", (done) ->
        MOCK_actor =
          act: ->
        MOCK_scheduler =
          next: -> MOCK_actor
        engine = new ROT.Engine MOCK_scheduler
        engine.unlock = -> done()
        engine.start()

    describe "lock", ->
      it "should increase the recursive lock count", ->
        MOCK_actor =
          act: ->
        MOCK_scheduler =
          next: -> MOCK_actor
        engine = new ROT.Engine MOCK_scheduler
        engine._lock.should.equal 1
        engine.lock()
        engine._lock.should.equal 2
        engine.lock()
        engine._lock.should.equal 3

    describe "unlock", ->
      it "should throw an error if unlocked beyond recursion", ->
        MOCK_actor =
          act: ->
        MOCK_scheduler =
          next: -> MOCK_actor
        engine = new ROT.Engine MOCK_scheduler
        engine._lock.should.equal 1
        engine._lock = 0
        engine._lock.should.equal 0
        should.throws(-> engine.unlock())

      it "should re-lock the engine if no actors are provided", ->
        MOCK_scheduler =
          next: -> null
        engine = new ROT.Engine MOCK_scheduler
        engine._lock.should.equal 1
        engine.unlock()
        engine._lock.should.equal 1

      it "should re-lock the engine if an actor returns a Promise", ->
        MOCK_actor =
          act: ->
            promise =
              "then": (keepPromise, breakPromise) ->
        MOCK_scheduler =
          next: -> MOCK_actor
        engine = new ROT.Engine MOCK_scheduler
        engine._lock.should.equal 1
        engine.unlock()
        engine._lock.should.equal 1

      it "should keep acting until locked again", ->
        MOCK_scheduler =
          next: ->
        engine = new ROT.Engine MOCK_scheduler
        maybeLock = _.after 5, (-> engine.lock())
        MOCK_actor =
          count: 0
          act: ->
            @count++
            throw new Error "Acting too much!" if @count > 10
            maybeLock()
        MOCK_scheduler.next = -> MOCK_actor
        engine.unlock()
        engine._lock.should.equal 1
        MOCK_actor.count.should.equal 5

#----------------------------------------------------------------------------
# end of engineTest.coffee
