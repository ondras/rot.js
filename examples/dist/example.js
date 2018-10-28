var o = {
	width: 11,
	height: 5
}
var d = new ROT.Display(o);
document.body.appendChild(d.getContainer());

for (var i=0; i<o.width; i++) {
	for (var j=0; j<o.height; j++) {
		if (!i || !j || i+1 == o.width || j+1 == o.height) {
			d.draw(i, j, "#", "gray");
		} else {
			d.draw(i, j, ".", "#666");
		}
	}
}
d.draw(o.width >> 1, o.height >> 1, "@", "goldenrod");
