VERSION = $(shell head -1 < VERSION)
SOURCES = 	src/rot.js \
			src/text.js \
			src/js/array.js \
			src/js/number.js \
			src/js/string.js \
			src/js/object.js \
			src/js/function.js \
			src/js/raf.js \
			src/display/display.js \
			src/display/backend.js \
			src/display/rect.js \
			src/display/hex.js \
			src/display/tile.js \
			src/rng.js \
			src/stringgenerator.js \
			src/eventqueue.js \
			src/scheduler/scheduler.js \
			src/scheduler/scheduler-simple.js \
			src/scheduler/scheduler-speed.js \
			src/scheduler/scheduler-action.js \
			src/engine.js \
			src/map/map.js \
			src/map/arena.js \
			src/map/dividedmaze.js \
			src/map/iceymaze.js \
			src/map/ellermaze.js \
			src/map/cellular.js \
			src/map/dungeon.js \
			src/map/digger.js \
			src/map/uniform.js \
			src/map/rogue.js \
			src/map/features.js \
			src/noise/noise.js \
			src/noise/simplex.js \
			src/fov/fov.js \
			src/fov/discrete-shadowcasting.js \
			src/fov/precise-shadowcasting.js \
			src/fov/recursive-shadowcasting.js \
			src/color.js \
			src/lighting.js \
			src/path/path.js \
			src/path/dijkstra.js \
			src/path/astar.js

rot.js: $(SOURCES)
	@echo Current rot.js version is $(VERSION)
	@echo "/*\n\
	\tThis is rot.js, the ROguelike Toolkit in JavaScript.\n\
	\tVersion $(VERSION), generated on $(shell date).\n\
	*/" > $@

	@cat $^ >> $@

rot.min.js: rot.js
	@echo "Calling closure compiler's REST API, this might take a while"
	@curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		-d charset=utf-8 \
		--data-urlencode "js_code@-" \
		http://closure-compiler.appspot.com/compile < $^ > $@

doc: rot.js
	@echo "Calling jsdoc to auto-generate documentation"
	@jsdoc rot.js -s -a -d=doc/

push:
	@hg bookmark -f master
	@hg bookmark -f gh-pages
	@hg push -B master -B gh-pages ; true
	@hg push github ; true

test:
	@cd tests; ./run.sh

clean:
	@echo "Removing generated JS files"
	@rm -f rot.js rot.min.js

.PHONY: all doc clean push test
