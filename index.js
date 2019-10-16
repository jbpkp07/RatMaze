"use strict";
const RatMaze = require("./javascript/RatMaze.js");
const terminal = require("terminal-kit").terminal;
const mapFileName = process.argv[2];
const mazeWidth = parseInt(process.argv[3]);
const mazeHeight = parseInt(process.argv[4]);
let ratMaze;
if (mazeHeight && mazeHeight) {
    ratMaze = new RatMaze(mapFileName, mazeWidth, mazeHeight);
}
else {
    ratMaze = new RatMaze(mapFileName);
}
const optimizedPath = ratMaze.solveMaze();
ratMaze.printMazeTraversal().then(() => {
    terminal.hideCursor();
    console.log("\n");
    console.log(optimizedPath);
    console.log("\n");
    terminal.hideCursor(""); // shows cursor again
});
