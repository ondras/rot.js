;(function() {
	let _subscribers = {};
	
	window.publish = function(message, publisher, data) {
		let subscribers = _subscribers[message] || [];
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
		let index = _subscribers[message].indexOf(subscriber);
		_subscribers[message].splice(index, 1);
	}
})();
