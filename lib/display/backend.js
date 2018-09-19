/**
 * @class Abstract display backend module
 * @private
 */
export default class Backend {
    constructor(context) { this._context = context; }
    compute(options) { this._options = options; }
    draw(data, clearBefore) { }
    computeSize(availWidth, availHeight) { }
    computeFontSize(availWidth, availHeight) { }
    eventToPosition(x, y) { }
}
