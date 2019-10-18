"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const process_1 = __importDefault(require("process"));
const terminal_kit_1 = require("terminal-kit");
const RatMaze_js_1 = require("./RatMaze.js");
const mapFileName = process_1.default.argv[2];
const mazeWidth = parseInt(process_1.default.argv[3]);
const mazeHeight = parseInt(process_1.default.argv[4]);
if (!fs_1.default.existsSync(`./maps/${mapFileName}.js`)) {
    terminal_kit_1.terminal.red("\n\n");
    terminal_kit_1.terminal.red("  You did not provide a map name argument. Please choose from:").cyan("  \"map1\", \"map2\", \"map3\"\n\n");
    terminal_kit_1.terminal.white("  Example:  ").cyan("node index.js map2\n\n");
    terminal_kit_1.terminal.white("  You can also supply a custom size to ").cyan("map3\n");
    terminal_kit_1.terminal.white("  Syntax:   node index.js map3 <width> <height>\n");
    terminal_kit_1.terminal.white("  Example:  ").cyan("node index.js map3 12 18\n\n");
    process_1.default.exit(0);
}
let ratMaze;
if (mazeHeight > 2 && mazeHeight > 2) {
    ratMaze = new RatMaze_js_1.RatMaze(mapFileName, mazeWidth, mazeHeight);
}
else {
    ratMaze = new RatMaze_js_1.RatMaze(mapFileName);
}
const optimizedPath = ratMaze.solveMaze();
ratMaze.printMazeTraversal().then(() => {
    terminal_kit_1.terminal.hideCursor();
    console.log("\n");
    console.log(optimizedPath);
    console.log("\n");
    terminal_kit_1.terminal.hideCursor(""); // shows cursor again
});
