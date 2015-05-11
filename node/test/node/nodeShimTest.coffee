# nodeShimTest.coffee
#----------------------------------------------------------------------------

should = require 'should'
require '../../lib/rot'

describe 'node-shim', ->
  it 'should not define window', ->
    should.not.exist global.window

  it 'should define a document object as a stub DOM', ->
    document.should.be.ok

  describe 'document', ->
    it 'should have DOM-like properties', ->
      document.should.have.properties ['body', 'createElement', 'documentElement']

    describe 'body', ->
      it 'should have DOM-like properties', ->
        document.body.should.have.properties ['appendChild', 'scrollLeft', 'scrollTop']
        
      it 'should have an appendChild stub method', ->
        document.body.should.have.property 'appendChild'
        should(document.body.appendChild()).not.be.ok

    describe 'createElement', ->
      it 'should return a <canvas> stub object', ->
        canvas = document.createElement()
        canvas.should.be.ok

      describe '<canvas>', ->
        canvas = document.createElement()

        it 'should have DOM-like properties', ->
          canvas.should.have.properties ['getBoundingClientRect', 'getContext', 'height', 'style', 'width']

        describe 'getBoundingClientRect', ->
          it 'should return a rect stub object', ->
            rect = canvas.getBoundingClientRect()
            rect.should.be.ok
            rect.should.have.properties ['left', 'top']

        describe 'getContext', ->
          it 'should return a CanvasRenderingContext2D stub object', ->
            context = canvas.getContext()
            context.should.be.ok

          describe 'CanvasRenderingContext2D', ->
            context = canvas.getContext()
            
            it 'should have DOM-like properties', ->
              context.should.have.properties [
                '_termcolor', 'beginPath', 'canvas', 'drawImage', 'fill',
                'fillRect', 'fillStyle', 'fillText', 'font', 'lineTo',
                'measureText', 'moveTo', 'textAlign', 'textBaseline' ]

            it 'should have a beginPath stub method', ->
              should(context.beginPath()).not.be.ok

            it 'should have a drawImage stub method', ->
              should(context.drawImage()).not.be.ok

            it 'should have a fill stub method', ->
              should(context.fill()).not.be.ok

            it 'should have a fillText stub method', ->
              should(context.fillText()).not.be.ok

            it 'should have a lineTo stub method', ->
              should(context.lineTo()).not.be.ok

            it 'should have a moveTo stub method', ->
              should(context.moveTo()).not.be.ok

            it 'should have a measureText stub method', ->
              result = context.measureText()
              result.should.have.property 'width'

            describe 'clearRect', ->
              it 'should do nothing when _termcolor is null', ->
                should(context._termcolor).equal null
                should(context.clearRect()).not.be.ok

              it 'should call _termcolor.clearToAnsi when _termcolor is defined', (done) ->
                old_termcolor = context['_termcolor']
                context['_termcolor'] =
                  clearToAnsi: ->
                    context['_termcolor'] = old_termcolor
                    done()
                    return ""
                should(context.clearRect()).not.be.ok

            describe 'fillRect', ->
              it 'should do nothing when _termcolor is null', ->
                should(context._termcolor).equal null
                should(context.fillRect()).not.be.ok

              it 'should call _termcolor.clearToAnsi when _termcolor is defined', (done) ->
                old_termcolor = context['_termcolor']
                context['_termcolor'] =
                  clearToAnsi: ->
                    context['_termcolor'] = old_termcolor
                    done()
                    return ""
                should(context.fillRect()).not.be.ok

        describe 'style', ->
          it 'should have DOM-like properties', ->
            canvas.style.should.have.properties ['left', 'position', 'top', 'visibility']

    describe 'documentElement', ->
      it 'should have DOM-like properties', ->
        document.documentElement.should.have.properties ['scrollLeft', 'scrollTop']

#----------------------------------------------------------------------------
# end of nodeShimTest.coffee
