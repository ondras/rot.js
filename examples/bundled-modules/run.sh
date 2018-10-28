#!/bin/sh

BABEL=../../node_modules/.bin/babel
ROLLUP=../../node_modules/.bin/rollup

$ROLLUP -i example.source.js -f iife | $BABEL -f example.source.js > example.bundle.js