export default class EventQueue<T = any> {
	_time: number;
	_events: MinHeap<T>;

	/**
	 * @class Generic event queue: stores events and retrieves them based on their time
	 */
	constructor() {
		this._time = 0;
		this._events = new MinHeap();
	}

	/**
	 * @returns {number} Elapsed time
	 */
	getTime() { return this._time; }

	/**
	 * Clear all scheduled events
	 */
	clear() {
		this._events = new MinHeap();
		return this;
	}

	/**
	 * @param {?} event
	 * @param {number} time
	 */
	add(event: T, time: number) {
		this._events.push({ key: time, value: event });
	}

	/**
	 * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
	 * @returns {? || null} The event previously added by addEvent, null if no event available
	 */
	get() {
		if (!this._events.len()) { return null; }

		let { key: time, value: event } = this._events.pop();
		if (time > 0) { /* advance */
			this._time += time;
			this._events.shift(-time);
		}

		return event;
	}

	/**
	 * Get the time associated with the given event
	 * @param {?} event
	 * @returns {number} time
	 */
	getEventTime(event: T) {
		const r = this._events.find(event);
		if (r) {
			const { key } = r;
			return key;
		}
		return undefined;
	}

	/**
	 * Remove an event from the queue
	 * @param {?} event
	 * @returns {bool} success?
	 */
	remove(event: T) {
		this._events.remove(event);
	};
}


interface HeapWrapper<T> {
	key: number,
	value: T
}

class MinHeap<T> {
	private heap: HeapWrapper<T>[];
	constructor() {
		this.heap = [];
	}
	shift(v: number) {
		this.heap = this.heap.map(({ key, value }) => ({ key: key + v, value }));
	}
	len() {
		return this.heap.length;
	}
	push(v: HeapWrapper<T>) {
		const loc = this.len();
		this.heap.push(v);
		this.updateUp(loc);
	}
	pop(): HeapWrapper<T> {
		if (this.len() == 0) {
			throw new Error("no element to pop");
		}
		const top = this.heap[0];
		if (this.len() > 1) {
			this.heap[0] = this.heap.pop() as HeapWrapper<T>;
			this.updateDown(0);
		} else {
			this.heap.pop();
		}
		return top;
	}
	find(v: T): HeapWrapper<T> | null {
		for (let i = 0; i < this.len(); i++) {
			if (v == this.heap[i].value) {
				return this.heap[i];
			}
		}
		return null;
	}
	remove(v: T) {
		let index = null;
		for (let i = 0; i < this.len(); i++) {
			if (v == this.heap[i].value) {
				index = i;
			}
		}
		if (index) {
			if (this.len() > 1) {
				this.heap[index] = this.heap.pop() as HeapWrapper<T>;
				this.updateDown(index);
				return true;
			} else {
				this.heap.pop();
				return true;
			}
		}
		return false;
	}
	private parentNode(x: number): number {
		return Math.floor((x - 1) / 2);
	}
	private leftChildNode(x: number): number {
		return 2 * x + 1;
	}
	private rightChildNode(x: number): number {
		return 2 * x + 2;
	}
	private existNode(x: number): boolean {
		return x >= 0 && x < this.heap.length;
	}
	private swap(x: number, y: number) {
		const t = this.heap[x];
		this.heap[x] = this.heap[y];
		this.heap[y] = t;
	}
	private minNode(numbers: number[]) {
		const validnumbers = numbers.filter(this.existNode.bind(this));
		let minimal = validnumbers[0];
		for (const i of validnumbers) {
			if (this.heap[i].key < this.heap[minimal].key) {
				minimal = i;
			}
		}
		return minimal;
	}
	private updateUp(x: number) {
		if (x == 0) {
			return;
		}
		const parent = this.parentNode(x);
		if (this.existNode(parent) && this.heap[x].key < this.heap[parent].key) {
			this.swap(x, parent);
			this.updateUp(parent);
		}
	}
	private updateDown(x: number) {
		const leftChild = this.leftChildNode(x);
		const rightChild = this.rightChildNode(x);
		if (!this.existNode(leftChild)) {
			return;
		}
		const m = this.minNode([x, leftChild, rightChild]);
		if (m != x) {
			this.swap(x, m);
			this.updateDown(m);
		}
	}
	debugPrint() {
		console.log(this.heap);
	}

}
