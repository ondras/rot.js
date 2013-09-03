/**
 * @class Base image (as ASCII art) converter
 */
ROT.Image = function() {
	this.aDefaultCharList = (" .,:;i1tfLCG08@").split("");
	this.aDefaultColorCharList = (" CGO08@").split("");
	this.strFont = "courier new";
	this.bBlock = true;
	this.bAlpha = false;
	this.bColor = true;
	this.strResolution = "low";
	
	this.ascii_art = "";
	this.ascii_art_array = null;
	this.height = 0;
	this.width = 0;
};

ROT.Image.prototype.loadASCII = function() {
	var aCharList = this.aDefaultCharList;
	var bBlock = this.bBlock;
	var bAlpha = this.bAlpha;
	var bColor = this.bColor;
	
	var oCanvas = document.createElement("canvas");
	if (!oCanvas.getContext) {
		return;
	}
	var oCtx = oCanvas.getContext("2d");
	if (!oCtx.getImageData) {
		return;
	}
	
	var strResolution = this.strResolution;
	
	var fResolution = 0.5;
	
	switch (strResolution) {
		case "low" : 	fResolution = 0.25;	break;
		case "medium" :	fResolution = 0.5;	break;
		case "high" : 	fResolution = 1;	break;
	}
	
	var iWidth = Math.round(parseInt(this.img.width) * fResolution);
	var iHeight = Math.round(parseInt(this.img.height) * fResolution);
	this.width = iWidth;
	this.height = iHeight;
	
	oCanvas.width = iWidth;
	oCanvas.height = iHeight;
	//oCanvas.style.display = "none";
	oCanvas.style.width = iWidth;
	oCanvas.style.height = iHeight;
	
	oCtx.drawImage(this.img, 0, 0, iWidth, iHeight);
	
	var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
	
	var strChars = "";
	var array_chars = [];
	
	for (var y=0;y<iHeight;y+=2) {
		array_chars[y] = [];
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
			var unscape_char = strThisChar;
			
			if (strThisChar == " ") 
				strThisChar = "&nbsp;";
			
			if (bColor) {
				strChars += "<span style='"
					+ "color:rgb("+iRed+","+iGreen+","+iBlue+");"
					+ (bBlock ? "background-color:rgb("+iRed+","+iGreen+","+iBlue+");" : "")
					+ (bAlpha ? "opacity:" + (iAlpha/255) + ";" : "")
					+ "'>" + strThisChar + "</span>";
				
				array_chars[y][x] = {'r': iRed, 'g' : iGreen, 'b' : iBlue, 'char': unscape_char};
			} else {
				strChars += strThisChar;
				array_chars[y][x] = {'char': unscape_char};
			}
		}
		strChars += "<br/>";
	}
	
	this.ascii_art_array = array_chars;
	
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
	return this.ascii_art_array[yin][xin];
};

ROT.Image.prototype.paint = function(display, offset_x, offset_y) {
	var i = 0;
	for (var y = 0; y < this.height; y += 2) {
		var j = 0;
		for (var x = 0; x < this.width; x++) {
			if (this.bColor) {
				var color = "#" +
					this.ascii_art_array[y][x]['r'].toString(16) +
					this.ascii_art_array[y][x]['g'].toString(16) +
					this.ascii_art_array[y][x]['b'].toString(16);
				if (this.bBlock) {
					display.draw(offset_x + j,  offset_y + i, this.ascii_art_array[y][x]['char'], color, color);
				}
				else {
					display.draw(offset_x + j,  offset_y + i, this.ascii_art_array[y][x]['char'], color);
				}
			}
			else {
				display.draw(offset_x + j,  offset_y + i, this.ascii_art_array[y][x]['char']);
			}
			j++;
		}
		i++;
	}
};