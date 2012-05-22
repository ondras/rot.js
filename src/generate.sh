#!/bin/sh
LIST="
rot.js
rng.js
js/array.js
js/date.js
js/number.js
js/string.js
js/object.js
js/function.js
display/display.js
map/map.js
map/arena.js
"

TARGET=../rot.js
rm -f $TARGET
for FILE in $LIST; do
	cat $FILE >> $TARGET
done
