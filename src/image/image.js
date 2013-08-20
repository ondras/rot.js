/**
 * @class Base image (as ASCII art) converter
 */
ROT.Image = function() {
	this.aDefaultCharList = (" .,:;i1tfLCG08@").split("");
	this.aDefaultColorCharList = (" CGO08@").split("");
	this.strFont = "courier new";
	
	this.ascii_art = "";
};

ROT.Image.prototype.loadASCII = function() {
	var aCharList = this.aDefaultCharList;
	var bBlock = true;
	var bAlpha = false;
	
	var oCanvas = document.createElement("canvas");
	if (!oCanvas.getContext) {
		return;
	}
	var oCtx = oCanvas.getContext("2d");
	if (!oCtx.getImageData) {
		return;
	}
	
	var strResolution = "low";
	
	var fResolution = 0.5;
	
	switch (strResolution) {
		case "low" : 	fResolution = 0.25;	break;
		case "medium" :	fResolution = 0.5;	break;
		case "high" : 	fResolution = 1;	break;
	}
	
	var iWidth = Math.round(parseInt(this.img.width) * fResolution);
	var iHeight = Math.round(parseInt(this.img.height) * fResolution);
	
	oCanvas.width = iWidth;
	oCanvas.height = iHeight;
	//oCanvas.style.display = "none";
	oCanvas.style.width = iWidth;
	oCanvas.style.height = iHeight;
	
	oCtx.drawImage(this.img, 0, 0, iWidth, iHeight);
	
	var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
	
	var strChars = "";
	
	for (var y=0;y<iHeight;y+=2) {
		for (var x=0;x<iWidth;x++) {
			var iOffset = (y*iWidth + x) * 4;
			
			var iRed = oImgData[iOffset];
			var iGreen = oImgData[iOffset + 1];
			var iBlue = oImgData[iOffset + 2];
			var iAlpha = oImgData[iOffset + 3];
			
			if (iAlpha == 0) {
				var iBrightIdx = 0;
			} else {
				var fBrightness = (0.3*iRed + 0.59*iGreen + 0.11*iBlue) / 255;
				var iCharIdx = (aCharList.length-1) - Math.round(fBrightness * (aCharList.length-1));
			}
			
			//~ if (bInvert) {
				//~ iCharIdx = (aCharList.length-1) - iCharIdx;
			//~ }
			var strThisChar = aCharList[iCharIdx];
			
			if (strThisChar == " ") 
				strThisChar = "&nbsp;";
			
			//~ if (bColor) {
				strChars += "<span style='"
					+ "color:rgb("+iRed+","+iGreen+","+iBlue+");"
					+ (bBlock ? "background-color:rgb("+iRed+","+iGreen+","+iBlue+");" : "")
					+ (bAlpha ? "opacity:" + (iAlpha/255) + ";" : "")
					+ "'>" + strThisChar + "</span>";
			//~ } else {
				//~ strChars += strThisChar;
			//~ }
		}
		strChars += "<br/>";
	}
	
	return strChars;
};

ROT.Image.prototype.load = function(image_url) {
	this.img = new Image();
	this.img.src = image_url;
	if (this.img.complete) {
		this.ascii_art = this.loadASCII();
	}
	else {
		this.img.onload = function() {
			this.ascii_art = this.loadASCII()
		}
	}
};

ROT.Image.prototype.get = function(xin, yin) {
	console.log(888);
};