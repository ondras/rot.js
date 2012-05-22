var Example = function(node) {
	this._node = node;
	this._pre = document.createElement("pre");
	this._result = document.createElement("div");
	this._ta = document.createElement("textarea");

	this._pre.setAttribute("data-syntax", "js");
	this._pre.addEventListener("click", this);
	this._ta.addEventListener("click", this);
	
	this._useCode(node.innerHTML);
}

Example.prototype.handleEvent = function(e) {
	e.stopPropagation();
	if (this.constructor.current != this) { this.open(); }
}

Example.prototype.open = function() {
	this.constructor.current = this;

	var style = getComputedStyle(this._pre);
	this._ta.style.width = style.width;
	this._ta.style.height = style.height;
	this._ta.value = this._pre.textContent;
	this._pre.parentNode.replaceChild(this._ta, this._pre);
	this._ta.focus();
}

Example.prototype.close = function() {
	this.constructor.current = null;
	var code = this._ta.value;
	this._useCode(code);
}

Example.prototype._useCode = function(code) {
	this._node.innerHTML = "";
	this._result.innerHTML = "";
	this._node.appendChild(this._pre);
	this._node.appendChild(this._result);
	this._pre.innerHTML = code;
	Syntax.apply(this._pre);
	
	var OUT = this._result;
	eval(code);
}

Example.current = null;
document.addEventListener("click", function() {
	if (Example.current) { Example.current.close(); }
});



var all = document.querySelectorAll(".example");
for (var i=0;i<all.length;i++) { new Example(all[i]); }
