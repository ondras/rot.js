interface Options {
    /** Use word mode? */
    words: boolean;
    /** Order, default = 3 */
    order: number;
    /** Prior value, default = 0.001 */
    prior: number;
}
declare type Events = {
    [key: string]: number;
};
/**
 * @class (Markov process)-based string generator.
 * Copied from a <a href="http://roguebasin.com/index.php/Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
 * Offers configurable order and prior.
 */
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
    /**
     * Remove all learning data
     */
    clear(): void;
    /**
     * @returns {string} Generated string
     */
    generate(): string;
    /**
     * Observe (learn) a string from a training set
     */
    observe(string: string): void;
    getStats(): string;
    /**
     * @param {string}
     * @returns {string[]}
     */
    _split(str: string): string[];
    /**
     * @param {string[]}
     * @returns {string}
     */
    _join(arr: string[]): string;
    /**
     * @param {string[]} context
     * @param {string} event
     */
    _observeEvent(context: string[], event: string): void;
    /**
     * @param {string[]}
     * @returns {string}
     */
    _sample(context: string[]): string;
    /**
     * @param {string[]}
     * @returns {string[]}
     */
    _backoff(context: string[]): string[];
}
export {};
