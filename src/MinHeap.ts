export interface HeapWrapper<T> {
	key: number,
	timestamp : number,
	value: T
}

export class MinHeap<T> {
	private heap: HeapWrapper<T>[];
	private timestamp : number;
	constructor() {
		this.heap = [];
		this.timestamp=0;
	}
	lessThan(a:HeapWrapper<T>,b:HeapWrapper<T>){
		return a.key==b.key?a.timestamp<b.timestamp:a.key<b.key;
	}
	shift(v: number) {
		this.heap = this.heap.map(({ key, value,timestamp }) => ({ key: key + v, value,timestamp }));
	}
	len() {
		return this.heap.length;
	}
	push(value: T,key : number) {
		this.timestamp+=1;
		const loc = this.len();
		this.heap.push({value,timestamp : this.timestamp,key});
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
		if (index === null) { return false; }

		if (this.len() > 1) {
			let last = this.heap.pop() as HeapWrapper<T>;
			if (last.value != v) { // if the last one is being removed, do nothing
				this.heap[index] = last;
				this.updateDown(index);
			}
			return true;
		} else {
			this.heap.pop();
		}

		return true;
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
			if (this.lessThan(this.heap[i],this.heap[minimal])) {
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
		if (this.existNode(parent) && this.lessThan(this.heap[x],this.heap[parent])) {
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

