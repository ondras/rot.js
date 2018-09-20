/** Default with for display and map generators */
export declare let DEFAULT_WIDTH: number;
/** Default height for display and map generators */
export declare let DEFAULT_HEIGHT: number;
export declare const DIRS: {
    4: number[][];
    8: number[][];
    6: number[][];
};
export declare const KEYS: {
    /** Cancel key. */
    VK_CANCEL: number;
    /** Help key. */
    VK_HELP: number;
    /** Backspace key. */
    VK_BACK_SPACE: number;
    /** Tab key. */
    VK_TAB: number;
    /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
    VK_CLEAR: number;
    /** Return/enter key on the main keyboard. */
    VK_RETURN: number;
    /** Reserved, but not used. */
    VK_ENTER: number;
    /** Shift key. */
    VK_SHIFT: number;
    /** Control key. */
    VK_CONTROL: number;
    /** Alt (Option on Mac) key. */
    VK_ALT: number;
    /** Pause key. */
    VK_PAUSE: number;
    /** Caps lock. */
    VK_CAPS_LOCK: number;
    /** Escape key. */
    VK_ESCAPE: number;
    /** Space bar. */
    VK_SPACE: number;
    /** Page Up key. */
    VK_PAGE_UP: number;
    /** Page Down key. */
    VK_PAGE_DOWN: number;
    /** End key. */
    VK_END: number;
    /** Home key. */
    VK_HOME: number;
    /** Left arrow. */
    VK_LEFT: number;
    /** Up arrow. */
    VK_UP: number;
    /** Right arrow. */
    VK_RIGHT: number;
    /** Down arrow. */
    VK_DOWN: number;
    /** Print Screen key. */
    VK_PRINTSCREEN: number;
    /** Ins(ert) key. */
    VK_INSERT: number;
    /** Del(ete) key. */
    VK_DELETE: number;
    /***/
    VK_0: number;
    /***/
    VK_1: number;
    /***/
    VK_2: number;
    /***/
    VK_3: number;
    /***/
    VK_4: number;
    /***/
    VK_5: number;
    /***/
    VK_6: number;
    /***/
    VK_7: number;
    /***/
    VK_8: number;
    /***/
    VK_9: number;
    /** Colon (:) key. Requires Gecko 15.0 */
    VK_COLON: number;
    /** Semicolon (;) key. */
    VK_SEMICOLON: number;
    /** Less-than (<) key. Requires Gecko 15.0 */
    VK_LESS_THAN: number;
    /** Equals (=) key. */
    VK_EQUALS: number;
    /** Greater-than (>) key. Requires Gecko 15.0 */
    VK_GREATER_THAN: number;
    /** Question mark (?) key. Requires Gecko 15.0 */
    VK_QUESTION_MARK: number;
    /** Atmark (@) key. Requires Gecko 15.0 */
    VK_AT: number;
    /***/
    VK_A: number;
    /***/
    VK_B: number;
    /***/
    VK_C: number;
    /***/
    VK_D: number;
    /***/
    VK_E: number;
    /***/
    VK_F: number;
    /***/
    VK_G: number;
    /***/
    VK_H: number;
    /***/
    VK_I: number;
    /***/
    VK_J: number;
    /***/
    VK_K: number;
    /***/
    VK_L: number;
    /***/
    VK_M: number;
    /***/
    VK_N: number;
    /***/
    VK_O: number;
    /***/
    VK_P: number;
    /***/
    VK_Q: number;
    /***/
    VK_R: number;
    /***/
    VK_S: number;
    /***/
    VK_T: number;
    /***/
    VK_U: number;
    /***/
    VK_V: number;
    /***/
    VK_W: number;
    /***/
    VK_X: number;
    /***/
    VK_Y: number;
    /***/
    VK_Z: number;
    /***/
    VK_CONTEXT_MENU: number;
    /** 0 on the numeric keypad. */
    VK_NUMPAD0: number;
    /** 1 on the numeric keypad. */
    VK_NUMPAD1: number;
    /** 2 on the numeric keypad. */
    VK_NUMPAD2: number;
    /** 3 on the numeric keypad. */
    VK_NUMPAD3: number;
    /** 4 on the numeric keypad. */
    VK_NUMPAD4: number;
    /** 5 on the numeric keypad. */
    VK_NUMPAD5: number;
    /** 6 on the numeric keypad. */
    VK_NUMPAD6: number;
    /** 7 on the numeric keypad. */
    VK_NUMPAD7: number;
    /** 8 on the numeric keypad. */
    VK_NUMPAD8: number;
    /** 9 on the numeric keypad. */
    VK_NUMPAD9: number;
    /** * on the numeric keypad. */
    VK_MULTIPLY: number;
    /** + on the numeric keypad. */
    VK_ADD: number;
    /***/
    VK_SEPARATOR: number;
    /** - on the numeric keypad. */
    VK_SUBTRACT: number;
    /** Decimal point on the numeric keypad. */
    VK_DECIMAL: number;
    /** / on the numeric keypad. */
    VK_DIVIDE: number;
    /** F1 key. */
    VK_F1: number;
    /** F2 key. */
    VK_F2: number;
    /** F3 key. */
    VK_F3: number;
    /** F4 key. */
    VK_F4: number;
    /** F5 key. */
    VK_F5: number;
    /** F6 key. */
    VK_F6: number;
    /** F7 key. */
    VK_F7: number;
    /** F8 key. */
    VK_F8: number;
    /** F9 key. */
    VK_F9: number;
    /** F10 key. */
    VK_F10: number;
    /** F11 key. */
    VK_F11: number;
    /** F12 key. */
    VK_F12: number;
    /** F13 key. */
    VK_F13: number;
    /** F14 key. */
    VK_F14: number;
    /** F15 key. */
    VK_F15: number;
    /** F16 key. */
    VK_F16: number;
    /** F17 key. */
    VK_F17: number;
    /** F18 key. */
    VK_F18: number;
    /** F19 key. */
    VK_F19: number;
    /** F20 key. */
    VK_F20: number;
    /** F21 key. */
    VK_F21: number;
    /** F22 key. */
    VK_F22: number;
    /** F23 key. */
    VK_F23: number;
    /** F24 key. */
    VK_F24: number;
    /** Num Lock key. */
    VK_NUM_LOCK: number;
    /** Scroll Lock key. */
    VK_SCROLL_LOCK: number;
    /** Circumflex (^) key. Requires Gecko 15.0 */
    VK_CIRCUMFLEX: number;
    /** Exclamation (!) key. Requires Gecko 15.0 */
    VK_EXCLAMATION: number;
    /** Double quote () key. Requires Gecko 15.0 */
    VK_DOUBLE_QUOTE: number;
    /** Hash (#) key. Requires Gecko 15.0 */
    VK_HASH: number;
    /** Dollar sign ($) key. Requires Gecko 15.0 */
    VK_DOLLAR: number;
    /** Percent (%) key. Requires Gecko 15.0 */
    VK_PERCENT: number;
    /** Ampersand (&) key. Requires Gecko 15.0 */
    VK_AMPERSAND: number;
    /** Underscore (_) key. Requires Gecko 15.0 */
    VK_UNDERSCORE: number;
    /** Open parenthesis (() key. Requires Gecko 15.0 */
    VK_OPEN_PAREN: number;
    /** Close parenthesis ()) key. Requires Gecko 15.0 */
    VK_CLOSE_PAREN: number;
    VK_ASTERISK: number;
    /** Plus (+) key. Requires Gecko 15.0 */
    VK_PLUS: number;
    /** Pipe (|) key. Requires Gecko 15.0 */
    VK_PIPE: number;
    /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
    VK_HYPHEN_MINUS: number;
    /** Open curly bracket ({) key. Requires Gecko 15.0 */
    VK_OPEN_CURLY_BRACKET: number;
    /** Close curly bracket (}) key. Requires Gecko 15.0 */
    VK_CLOSE_CURLY_BRACKET: number;
    /** Tilde (~) key. Requires Gecko 15.0 */
    VK_TILDE: number;
    /** Comma (,) key. */
    VK_COMMA: number;
    /** Period (.) key. */
    VK_PERIOD: number;
    /** Slash (/) key. */
    VK_SLASH: number;
    /** Back tick (`) key. */
    VK_BACK_QUOTE: number;
    /** Open square bracket ([) key. */
    VK_OPEN_BRACKET: number;
    /** Back slash (\) key. */
    VK_BACK_SLASH: number;
    /** Close square bracket (]) key. */
    VK_CLOSE_BRACKET: number;
    /** Quote (''') key. */
    VK_QUOTE: number;
    /** Meta key on Linux, Command key on Mac. */
    VK_META: number;
    /** AltGr key on Linux. Requires Gecko 15.0 */
    VK_ALTGR: number;
    /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
    VK_WIN: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANA: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANGUL: number;
    /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
    VK_EISU: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_JUNJA: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_FINAL: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANJA: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANJI: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_CONVERT: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_NONCONVERT: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_ACCEPT: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_MODECHANGE: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_SELECT: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_PRINT: number;
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_EXECUTE: number;
    /** Linux support for this keycode was added in Gecko 4.0.	 */
    VK_SLEEP: number;
};
