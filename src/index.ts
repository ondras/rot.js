export {default as RNG} from "./rng.js";
export {default as Display} from "./display/display.js";

import { clamp, mod, capitalize, format } from "./util.js";
export const util = { clamp, mod, capitalize, format };

export { DEFAULT_WIDTH, DEFAULT_HEIGHT /*, DIRS, KEYS */ } from "./constants.js";
