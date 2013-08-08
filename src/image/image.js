/**
 * @class Base image (as ASCII art) converter
 */
ROT.Image = function() {
	this.aDefaultCharList = (" .,:;i1tfLCG08@").split("");
	this.aDefaultColorCharList = (" CGO08@").split("");
	this.strFont = "courier new";
};

ROT.Image.prototype.get = function(xin, yin) {
	console.log(888);
}
