# rot.js for Node.js
Ondrej Zara's ROguelike Toolkit for Node.js

There is an incredible [interactive manual](http://ondras.github.io/rot.js/manual/)
to learn rot.js. The notes below are specific to the Node.js version.

## ROT.Display
The Node.js version does not have a `<canvas>` element, and so the standard
`layout` algorithms (`rect` and `hex`) do not work. The Node.js version does,
however, have its own layout type: `term`

    var display = new ROT.Display({width:40, height:9, layout:"term"});
    display.draw(5,  4, "@");
    display.draw(15, 4, "%", "#0f0");          /* foreground color */
    display.draw(25, 4, "#", "#f00", "#009");  /* and background color */

RGB colors are supported for `xterm` compatible terminals.

## Istanbul coverage
A set of unit tests offering nearly universal coverage is available.

    git clone https://github.com/ondras/rot.js
    cd rot.js
    make node
    npm install
    cake coverage

### Coverage exceptions
* `src/js/object.js` provides `Object.create` for environments that do not have
their own `Object.create`. Node.js provides this method, so the code provided
by rot.js will never execute.

* `src/js/raf.js` provides `cancelAnimationFrame` and `requestAnimationFrame`
for environments that provide a `window` object, but do not provide
their own animation frame functions. Node.js does not provide a `window`
object, so the code provided by rot.js will never execute.

* `src/path/astar.js` defines a method `ROT.Path.AStar.prototype._distance`
that contains a switch statement. There are some unreachable break statements
here to improve code aesthetics (case/break balance).

* Some of the tests rely on the random generation process to cover the
cases of the generator. On bad runs, a poor random seed will leave coverage
gaps. In this case, re-run the tests until you are happy. :-)
