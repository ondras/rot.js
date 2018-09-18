# rot.js

ROguelike Toolkit in JavaScript. For more info, see http://ondras.github.com/rot.js.

## Library

There are multiple ways of including rot.js in your project.

### Downloading

You can get rot.js using either of these methods:

  - clone this repository to gain full source code access;
  - `npm install rot-js`;
  - download the [prebuilt rot.js file](dist/rot.js) (or the [minified rot.min.js file](dist/rot.min.js)) to include it in your project.

### Usage

Rot.js is written in TypeScript, but its code is available in multiple formats. You can pick the one that best suits your development needs.

  1. The `lib/` directory contains the code in [ES2015](FIXME) modules. These can be used in modern browsers directly, without any transpilation/bundling step. An [example](FIXME) shows how to do that.

  1. For practical reasons, individual modules should be bundled to make your application more compact. You are free to use any bundler that understands ES2015 modules. If you want tu support older browsers, you should also transpile your code -- there is [an example using babel and rollup](FIXME) that shows how to do that. This is the recommended way of using rot.js.

  1. If you do not fancy modern modules and/or transpilation, you can grab a [pre-built bundle](FIXME) and include it in your page using traditional `<script>` tag. This bundle puts rot.js into a global `ROT` namespace and uses ES5 (supported even by older browsers).

  1. Finally, the pre-built budle also comes with [a minified version](FIXME) that works the same, but its size has been reduced. 

RogueBasin page (with links to some rot.js-based games): http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js
