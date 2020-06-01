export interface HeapWrapper<T> {
    key: number;
    timestamp: number;
    value: T;
}
export declare class MinHeap<T> {
    private heap;
    private timestamp;
    constructor();
    lessThan(a: HeapWrapper<T>, b: HeapWrapper<T>): boolean;
    shift(v: number): void;
    len(): number;
    push(value: T, key: number): void;
    pop(): HeapWrapper<T>;
    find(v: T): HeapWrapper<T> | null;
    remove(v: T): boolean;
    private parentNode;
    private leftChildNode;
    private rightChildNode;
    private existNode;
    private swap;
    private minNode;
    private updateUp;
    private updateDown;
    debugPrint(): void;
}
