interface Options {
    words: boolean;
    order: number;
    prior: number;
}
declare type Events = {
    [key: string]: number;
};
export default class StringGenerator {
    _options: Options;
    _boundary: string;
    _suffix: string;
    _prefix: string[];
    _priorValues: {
        [key: string]: number;
    };
    _data: {
        [key: string]: Events;
    };
    constructor(options: Partial<Options>);
    clear(): void;
    generate(): string;
    observe(string: string): void;
    getStats(): string;
    _split(str: string): string[];
    _join(arr: string[]): string;
    _observeEvent(context: string[], event: string): void;
    _sample(context: string[]): string;
    _backoff(context: string[]): string[];
}
export {};
