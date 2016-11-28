rot.js _(with ASCIIart support)_
================================

**RO**guelike **T**oolkit in **J**ava**S**cript. For more info, see https://github.com/mdtrooper/rot.js.

To install `rot.js`, pick one:
  - clone this repository to gain full source code access;
  - download just the [minified rot.min.js file](https://github.com/mdtrooper/rot.js/blob/master/rot.min.js) to include it in your project;
  - use `bower install rot.js`, if you prefer Bower for package management;

RogueBasin page (with links to some rot.js-based games): http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js

ASCIIart support
----------------
This fork has a support for [ASCIIart (link to wikipedia)](http://en.wikipedia.org/wiki/ASCII_art) for you use the image files in native format (jpg, png…) and the game shows a pretty ASCIIart.

It is very easy to use.

```javascript
var image = new ROT.Image();

image.strResolution = "medium";
image.bBlock = false;
image.load("combat.png");

var display = new ROT.Display({width:w, height:h, fontSize:10});

image.paint(display, 0, 0);
```

The image methods are:
* load(url): get a image from url and convert to ASCIIart.
* blit(display, display_x, display_y, image_x, image_y, rect_w, rect_h): paint a part of ASCIIart into the display.
* paint(display, offset_x, offset_y): paint the entire ASCIIart into a position in the display.

And the config attributes are:
* bBlock: for to paint blocks instead characters.
* bColor: ASCIIart in color or not.
* strResolution: (low, medium, high) the ASCII art resolution.
