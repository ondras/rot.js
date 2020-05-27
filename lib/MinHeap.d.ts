export interface HeapWrapper<T> {
    key: number;
    value: T;
}
export declare class MinHeap<T> {
    private heap;
    constructor();
    shift(v: number): void;
    len(): number;
    push(v: HeapWrapper<T>): void;
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
