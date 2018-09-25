import Dungeon from "./dungeon.js";
import { Room, Corridor } from "./features.js";
import RNG from "../rng.js";
import { DIRS } from "../constants.js";
const FEATURES = {
    "room": Room,
    "corridor": Corridor
};
export default class Digger extends Dungeon {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = Object.assign({
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            corridorLength: [3, 10],
            dugPercentage: 0.2,
            timeLimit: 1000
        }, options);
        this._features = {
            "room": 4,
            "corridor": 4
        };
        this._map = [];
        this._featureAttempts = 20;
        this._walls = {};
        this._dug = 0;
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
        this._priorityWallCallback = this._priorityWallCallback.bind(this);
    }
    create(callback) {
        this._rooms = [];
        this._corridors = [];
        this._map = this._fillMap(1);
        this._walls = {};
        this._dug = 0;
        var area = (this._width - 2) * (this._height - 2);
        this._firstRoom();
        var t1 = Date.now();
        let priorityWalls;
        do {
            priorityWalls = 0;
            var t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                break;
            }
            var wall = this._findWall();
            if (!wall) {
                break;
            }
            var parts = wall.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            var dir = this._getDiggingDirection(x, y);
            if (!dir) {
                continue;
            }
            var featureAttempts = 0;
            do {
                featureAttempts++;
                if (this._tryFeature(x, y, dir[0], dir[1])) {
                    this._removeSurroundingWalls(x, y);
                    this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                    break;
                }
            } while (featureAttempts < this._featureAttempts);
            for (var id in this._walls) {
                if (this._walls[id] > 1) {
                    priorityWalls++;
                }
            }
        } while (this._dug / area < this._options.dugPercentage || priorityWalls);
        this._addDoors();
        if (callback) {
            for (var i = 0; i < this._width; i++) {
                for (var j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        this._walls = {};
        this._map = [];
        return this;
    }
    _digCallback(x, y, value) {
        if (value == 0 || value == 2) {
            this._map[x][y] = 0;
            this._dug++;
        }
        else {
            this._walls[x + "," + y] = 1;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _priorityWallCallback(x, y) { this._walls[x + "," + y] = 2; }
    ;
    _firstRoom() {
        var cx = Math.floor(this._width / 2);
        var cy = Math.floor(this._height / 2);
        var room = Room.createRandomCenter(cx, cy, this._options);
        this._rooms.push(room);
        room.create(this._digCallback);
    }
    _findWall() {
        var prio1 = [];
        var prio2 = [];
        for (var id in this._walls) {
            var prio = this._walls[id];
            if (prio == 2) {
                prio2.push(id);
            }
            else {
                prio1.push(id);
            }
        }
        var arr = (prio2.length ? prio2 : prio1);
        if (!arr.length) {
            return null;
        }
        id = RNG.getItem(arr.sort());
        delete this._walls[id];
        return id;
    }
    _tryFeature(x, y, dx, dy) {
        let featureName = RNG.getWeightedValue(this._features);
        let ctor = FEATURES[featureName];
        let feature = ctor.createRandomAt(x, y, dx, dy, this._options);
        if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
            return false;
        }
        feature.create(this._digCallback);
        if (feature instanceof Room) {
            this._rooms.push(feature);
        }
        if (feature instanceof Corridor) {
            feature.createPriorityWalls(this._priorityWallCallback);
            this._corridors.push(feature);
        }
        return true;
    }
    _removeSurroundingWalls(cx, cy) {
        var deltas = DIRS[4];
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            var x = cx + delta[0];
            var y = cy + delta[1];
            delete this._walls[x + "," + y];
            var x = cx + 2 * delta[0];
            var y = cy + 2 * delta[1];
            delete this._walls[x + "," + y];
        }
    }
    _getDiggingDirection(cx, cy) {
        if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
            return null;
        }
        var result = null;
        var deltas = DIRS[4];
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            var x = cx + delta[0];
            var y = cy + delta[1];
            if (!this._map[x][y]) {
                if (result) {
                    return null;
                }
                result = delta;
            }
        }
        if (!result) {
            return null;
        }
        return [-result[0], -result[1]];
    }
    _addDoors() {
        let data = this._map;
        function isWallCallback(x, y) {
            return (data[x][y] == 1);
        }
        ;
        for (let i = 0; i < this._rooms.length; i++) {
            let room = this._rooms[i];
            room.clearDoors();
            room.addDoors(isWallCallback);
        }
    }
}
