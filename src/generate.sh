#!/bin/sh
TARGET=../rot.js
rm -f $TARGET
for I in $(find . -type d); do
	for FILE in $(ls $I/*.js); do
		cat $FILE >> $TARGET
	done
done
