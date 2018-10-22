BIN := node_modules/.bin
BABEL := $(BIN)/babel
ROLLUP := $(BIN)/rollup
TYPEDOC := $(BIN)/typedoc
TSC := $(BIN)/tsc
GCC := $(BIN)/google-closure-compiler
JASMINE := $(BIN)/jasmine

ES5 := dist/rot.js
ES5_MIN := dist/rot.min.js
TS_FLAG := .ts.flag
TS_SRC :=  $(shell find src -name '*.ts')

all: $(ES5_MIN) doc

doc: $(TS_FLAG)
	$(TYPEDOC) --out doc --readme none --excludePrivate --excludeProtected --listInvalidSymbolLinks --name "rot.js" $(TS_SRC)

$(ES5_MIN): $(ES5)
	$(GCC) < $^ > $@

$(ES5): $(TS_FLAG)
	$(ROLLUP) -c | $(BABEL) -f $@ > $@

$(TS_FLAG): $(TS_SRC)
	$(TSC)
	@touch $@

build.png: build.dot
	dot -Tpng $^ > build.png

clean:
	rm -rf doc/*
	rm -rf dist/*
	rm -rf lib/*
	rm -rf $(TS_FLAG)

test:
	node tests/run.js

watch: all
	while inotifywait -e MODIFY -r src; do make $^ ; done

.PHONY: clean dot watch test

.DELETE_ON_ERROR:
