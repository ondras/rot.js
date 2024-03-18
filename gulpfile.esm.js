import gulp from 'gulp';
import typedoc from 'gulp-typedoc';
import typescript from 'gulp-typescript';
import rollup from '@rollup/stream';
import babel from 'gulp-babel';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gcc from 'google-closure-compiler';
import { spawn } from 'child_process';
import { execPath } from 'process';

import rollupConfig from './rollup.config.js';
import { promises as fsPromises } from 'fs';

const ES5_DIR = "dist";
const ES5_JS = "rot.js";
const ES5_MIN_JS = "rot.min.js";
const TS_SRC = "src/**/*.ts";
/** @satisfies {Partial<import("typedoc").TypeDocOptions>} */
const typedocOptions = {
    out: "doc",
    readme: "none",
    excludePrivate: true,
    excludeProtected: true,
    name: "rot.js",
    validation: {
        invalidLink: true,
    },
};

const tsProject = typescript.createProject("tsconfig.json");

const closure = gcc.gulp();

export function doc() {
    return gulp.src(TS_SRC)
        .pipe(typedoc(typedocOptions))
}

export function tsc() {
    return gulp.src(TS_SRC)
        .pipe(tsProject())
        .pipe(gulp.dest("lib"))
}

export function es5() {
    return rollup(rollupConfig)
        .pipe(source(ES5_JS))
        .pipe(buffer())
        .pipe(babel())
        .pipe(gulp.dest(ES5_DIR))
}

export function es5_min(_cb, src = src(`${ES5_DIR}/${ES5_JS}`)) {
    return src
        .pipe(closure({
            js_output_file: ES5_MIN_JS,
        }, {
            // platform: ['native', 'java', 'javascript'],
        }))
        .pipe(gulp.dest(ES5_DIR))
}

export function es5_all(cb) {
    return es5_min(cb, es5());
}

export const build = gulp.parallel(
    doc,
    gulp.series(
        tsc,
        es5_all,
    )
);

export function dot() {
    return spawn("dot", ["-Tpng", "build.png"]);
}

export async function clean() {
    await fsPromises.rm("doc", {recursive: true, force: true})
    await fsPromises.rm("dist", {recursive: true, force: true})
    await fsPromises.rm("lib", {recursive: true, force: true})
}

export function test() {
    return spawn(execPath, ["tests/run.js"], {stdio: 'inherit'})
}

export function watch(cb) {
    return gulp.watch(TS_SRC, build)
}
