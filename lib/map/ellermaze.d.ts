import Map, { CreateCallback } from "./map.js";
/**
 * Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */
export default class EllerMaze extends Map {
    create(callback: CreateCallback): this;
}
