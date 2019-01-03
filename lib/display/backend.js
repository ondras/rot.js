/**
 * @class Abstract display backend module
 * @private
 */
export default class Backend {
    getContainer() { return null; }
    setOptions(options) { this._options = options; }
}
