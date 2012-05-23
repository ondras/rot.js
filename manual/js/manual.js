var Example = function(node) {
	this._node = node;
	this._source = OZ.DOM.elm("pre", {className:"code"});
	this._source.setAttribute("data-syntax", "js");
	this._source.addEventListener("click", this);
	
	this._ta = OZ.DOM.elm("textarea", {className:"code"});
	this._ta.spellcheck = false;
	this._ta.addEventListener("click", this);
	
	this._result = OZ.DOM.elm("pre", {className:"result"});

	this._time = OZ.DOM.elm("div", {className:"time"});

	this._useCode(node.innerHTML);

}

Example.prototype.handleEvent = function(e) {
	e.stopPropagation();
	if (this.constructor.current != this) { this.open(); }
}

Example.prototype.open = function() {
	this.constructor.current = this;

	this._ta.style.height = this._source.offsetHeight + "px";
	this._ta.value = this._source.textContent;
	this._source.parentNode.replaceChild(this._ta, this._source);
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
	this._node.appendChild(this._source);
	this._node.appendChild(this._result);
	this._node.appendChild(this._time);
	this._source.innerHTML = code;
	Syntax.apply(this._source);
	
	var result = this._result;
	var SHOW = function() { 
		for (var i=0;i<arguments.length;i++) {
			var arg = arguments[i];
			if (!arg.nodeType) {
				arg = OZ.DOM.elm("div", {innerHTML:arg});
			}
			result.appendChild(arg);
		}
	}

	var t1 = Date.now();
	eval(code);
	var t2 = Date.now();
	
	this._time.innerHTML = "(executed in %sms)".format(t2-t1);
}

Example.current = null;
document.addEventListener("click", function() {
	if (Example.current) { Example.current.close(); }
});


var Manual = {
	_hash: "",
	_hashChange: function(e) {
		var hash = location.hash || "intro";
		if (hash.charAt(0) == "#") { hash = hash.substring(1); }
		if (hash == this._hash) { return; }
		this._hash = hash;
		
		this._switchTo(this._hash);
	},
	
	_switchTo: function(what) {
		OZ.Request("pages/" + what + ".html", this._response.bind(this));
		
		var links = document.querySelectorAll("#menu a");
		for (var i=0;i<links.length;i++) {
			var link = links[i];
			if (link.href.lastIndexOf(what) == link.href.length - what.length) {
				OZ.DOM.addClass(link, "active");
			} else {
				OZ.DOM.removeClass(link, "active");
			}
		}
	},
	
	_response: function(data, status) {
		if (status != 200) { return; }
		document.querySelector("#content").innerHTML = data;

		var all = document.querySelectorAll("#content .example");
		for (var i=0;i<all.length;i++) { new Example(all[i]); }
	},
	
	init: function() {
		OZ.Event.add(window, "hashchange", this._hashChange.bind(this));
		this._hashChange();
	}
	
}

Manual.init();
