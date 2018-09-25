export default class EventQueue<T = any> {
    _time: number;
    _eventTimes: number[];
    _events: T[];
    constructor();
    getTime(): number;
    clear(): this;
    add(event: T, time: number): void;
    get(): T | null;
    getEventTime(event: T): number | undefined;
    remove(event: T): boolean;
    _remove(index: number): void;
}
