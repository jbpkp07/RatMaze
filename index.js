"use strict";
const RatMaze = require("./javascript/RatMaze.js");
const terminal = require("terminal-kit").terminal;
const mapFileName = process.argv[2];
const ratMaze = new RatMaze(mapFileName);
const optimizedPath = ratMaze.solveMaze();
ratMaze.printMazeTraversal().then(() => {
    terminal.hideCursor();
    console.log("\n");
    console.log(optimizedPath);
    console.log("\n");
    terminal.hideCursor(""); // shows cursor again
});
