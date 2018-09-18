;(function() {
	var _subscribers = {};
	
	window.publish = function(message, publisher, data) {
		var subscribers = _subscribers[message] || [];
		subscribers.forEach(function(subscriber) {
			subscriber.handleMessage(message, publisher, data);
		});
	}
	
	window.subscribe = function(message, subscriber) {
		if (!(message in _subscribers)) {
			_subscribers[message] = [];
		}
		_subscribers[message].push(subscriber);
	},
	
	window.unsubscribe = function(message, subscriber) {
		var index = _subscribers[message].indexOf(subscriber);
		_subscribers[message].splice(index, 1);
	}
})();
