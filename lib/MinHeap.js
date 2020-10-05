export class MinHeap {
    constructor() {
        this.heap = [];
        this.timestamp = 0;
    }
    lessThan(a, b) {
        return a.key == b.key ? a.timestamp < b.timestamp : a.key < b.key;
    }
    shift(v) {
        this.heap = this.heap.map(({ key, value, timestamp }) => ({ key: key + v, value, timestamp }));
    }
    len() {
        return this.heap.length;
    }
    push(value, key) {
        this.timestamp += 1;
        const loc = this.len();
        this.heap.push({ value, timestamp: this.timestamp, key });
        this.updateUp(loc);
    }
    pop() {
        if (this.len() == 0) {
            throw new Error("no element to pop");
        }
        const top = this.heap[0];
        if (this.len() > 1) {
            this.heap[0] = this.heap.pop();
            this.updateDown(0);
        }
        else {
            this.heap.pop();
        }
        return top;
    }
    find(v) {
        for (let i = 0; i < this.len(); i++) {
            if (v == this.heap[i].value) {
                return this.heap[i];
            }
        }
        return null;
    }
    remove(v) {
        let index = null;
        for (let i = 0; i < this.len(); i++) {
            if (v == this.heap[i].value) {
                index = i;
            }
        }
        if (index === null) {
            return false;
        }
        if (this.len() > 1) {
            let last = this.heap.pop();
            if (last.value != v) { // if the last one is being removed, do nothing
                this.heap[index] = last;
                this.updateDown(index);
            }
            return true;
        }
        else {
            this.heap.pop();
        }
        return true;
    }
    parentNode(x) {
        return Math.floor((x - 1) / 2);
    }
    leftChildNode(x) {
        return 2 * x + 1;
    }
    rightChildNode(x) {
        return 2 * x + 2;
    }
    existNode(x) {
        return x >= 0 && x < this.heap.length;
    }
    swap(x, y) {
        const t = this.heap[x];
        this.heap[x] = this.heap[y];
        this.heap[y] = t;
    }
    minNode(numbers) {
        const validnumbers = numbers.filter(this.existNode.bind(this));
        let minimal = validnumbers[0];
        for (const i of validnumbers) {
            if (this.lessThan(this.heap[i], this.heap[minimal])) {
                minimal = i;
            }
        }
        return minimal;
    }
    updateUp(x) {
        if (x == 0) {
            return;
        }
        const parent = this.parentNode(x);
        if (this.existNode(parent) && this.lessThan(this.heap[x], this.heap[parent])) {
            this.swap(x, parent);
            this.updateUp(parent);
        }
    }
    updateDown(x) {
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
