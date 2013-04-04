#!/bin/sh
LIST="
rot.js
text.js
js/array.js
js/number.js
js/string.js
js/object.js
js/function.js
display/display.js
display/backend.js
display/rect.js
display/hex.js
rng.js
stringgenerator.js
eventqueue.js
scheduler/scheduler.js
scheduler/scheduler-simple.js
scheduler/scheduler-speed.js
scheduler/scheduler-action.js
engine.js
map/map.js
map/arena.js
map/dividedmaze.js
map/iceymaze.js
map/ellermaze.js
map/cellular.js
map/dungeon.js
map/digger.js
map/uniform.js
map/rogue.js
map/features.js
noise/noise.js
noise/simplex.js
fov/fov.js
fov/discrete-shadowcasting.js
fov/precise-shadowcasting.js
color.js
lighting.js
path/path.js
path/dijkstra.js
path/astar.js
"

star() {
	echo -n "\033[1;${1}m * \033[0m"
}

TARGET=../rot.js
MTARGET=../rot.min.js
star 31
echo "Removing old ${TARGET} and ${MTARGET}"
rm -f $TARGET
rm -f $MTARGET

VERSION=$(head -1 < ../VERSION)
star 33
echo "Current version is ${VERSION}"

PROLOGUE="/*
	This is rot.js, the ROguelike Toolkit in JavaScript.
	Version $VERSION, generated on $(date).
*/
"
echo "$PROLOGUE" >> $TARGET

for FILE in $LIST; do
	cat $FILE >> $TARGET
done

# closure compiler
star 32
echo "Calling closure compiler's REST API, this might take a while"
curl -s \
	-d compilation_level=SIMPLE_OPTIMIZATIONS \
	-d output_format=text \
	-d output_info=compiled_code \
	-d charset=utf-8 \
	--data-urlencode "js_code@-" \
	http://closure-compiler.appspot.com/compile < $TARGET > $MTARGET
