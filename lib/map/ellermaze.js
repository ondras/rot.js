import Map from "./map.js";
import RNG from "../rng.js";
function addToList(i, L, R) {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
}
function removeFromList(i, L, R) {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
}
export default class EllerMaze extends Map {
    create(callback) {
        let map = this._fillMap(1);
        let w = Math.ceil((this._width - 2) / 2);
        let rand = 9 / 24;
        let L = [];
        let R = [];
        for (let i = 0; i < w; i++) {
            L.push(i);
            R.push(i);
        }
        L.push(w - 1);
        let j;
        for (j = 1; j + 3 < this._height; j += 2) {
            for (let i = 0; i < w; i++) {
                let x = 2 * i + 1;
                let y = j;
                map[x][y] = 0;
                if (i != L[i + 1] && RNG.getUniform() > rand) {
                    addToList(i, L, R);
                    map[x + 1][y] = 0;
                }
                if (i != L[i] && RNG.getUniform() > rand) {
                    removeFromList(i, L, R);
                }
                else {
                    map[x][y + 1] = 0;
                }
            }
        }
        for (let i = 0; i < w; i++) {
            let x = 2 * i + 1;
            let y = j;
            map[x][y] = 0;
            if (i != L[i + 1] && (i == L[i] || RNG.getUniform() > rand)) {
                addToList(i, L, R);
                map[x + 1][y] = 0;
            }
            removeFromList(i, L, R);
        }
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        return this;
    }
}
