function elm(name, attrs) {
	var node = document.createElement(name);
	Object.assign(node, attrs);
	return node;
}

var Example = function(node) {
	this._node = node;
	
	this._source = elm("pre", {className:"code"});
	this._source.setAttribute("data-syntax", "js");
	this._source.addEventListener("click", this);
	
	this._ta = elm("textarea", {className:"code"});
	this._ta.spellcheck = false;
	this._ta.addEventListener("click", this);
	
	this._result = elm("pre", {className:"result"});

	this._time = elm("div", {className:"time"});

	this._useCode(node.textContent);
}

Example.prototype.handleEvent = function(e) {
	e.stopPropagation();
	if (this.constructor.current != this) { this.open(); }
}

Example.prototype.open = function() {
	this.constructor.current = this;
	var height = this._source.offsetHeight;
	this._ta.style.height = height + "px";
	this._ta.value = this._source.textContent.trim();
	this._source.parentNode.replaceChild(this._ta, this._source);
	this._ta.focus();
}

Example.prototype.close = function() {
	this.constructor.current = null;
	var code = this._ta.value;
	this._useCode(code);
}

/**
 * @param {string} code no html entities, plain code
 */
Example.prototype._useCode = function(code) {
	this._node.innerHTML = "";
	this._result.innerHTML = "";
	this._source.innerHTML = "";
	this._node.appendChild(this._source);
	this._node.appendChild(this._result);
	this._node.appendChild(this._time);
	this._source.appendChild(document.createTextNode(code));
	Syntax.apply(this._source);
	
	var result = this._result;
	var show = function() { 
		for (var i=0;i<arguments.length;i++) {
			var arg = arguments[i];
			if (!arg.nodeType) {
				arg = elm("div", {innerHTML:arg});
			}
			result.appendChild(arg);
		}
	}

	var t1 = Date.now();
	this._eval(code, show);
	var t2 = Date.now();
	this._time.innerHTML = ROT.Util.format("executed in %{s}ms", t2-t1);
}

Example.prototype._eval = function(code, SHOW) {
	try {
		eval(code);
	} catch (e) {
		let node = document.createElement("div");
		node.className = "error";
		node.textContent = e.toString();
		SHOW(node);
	}
}

Example.current = null;
document.addEventListener("click", function() {
	if (Example.current) { Example.current.close(); }
}, false);


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
		var xhr = new XMLHttpRequest();
		xhr.open("get", "pages/" + what + ".html?" + Math.random(), true);
		xhr.onload = function() {
			this._response(xhr.responseText, xhr.status);
		}.bind(this);
		xhr.send();
		
		var links = document.querySelectorAll("#menu a");
		for (var i=0;i<links.length;i++) {
			var link = links[i];
			if (link.href.lastIndexOf(what) == link.href.length - what.length) {
				link.classList.add(link, "active");
				var parent = link.parentNode.parentNode.parentNode;
				if (parent.nodeName.toLowerCase() == "li") {
					parent.querySelector("a").classList.add("active");
				}
			} else {
				link.classList.remove("active");
			}
		}
	},
	
	_response: function(data, status) {
		if (status != 200) { return; }
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		document.querySelector("#content").innerHTML = data;

		var all = document.querySelectorAll("#content .example");
		for (var i=0;i<all.length;i++) { new Example(all[i]); }
	},
	
	init: function() {
		var year = new Date().getFullYear();
		document.querySelector("#year").innerHTML = year;

		var xhr = new XMLHttpRequest();
		xhr.open("get", "../package.json", true);
		xhr.onload = function() {
			var package = JSON.parse(xhr.responseText);
			document.querySelector("h1").innerHTML += "<span>v" + package.version + "</span>";
		}
		xhr.send();
		
		window.addEventListener("hashchange", this._hashChange.bind(this));
		this._hashChange();
	}
	
}

Manual.init();
