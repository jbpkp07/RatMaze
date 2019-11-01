import fs from "fs";
import process from "process";
import { terminal } from "terminal-kit";

import { RatMaze } from "./RatMaze";

const mapFileName: string = process.argv[2];
const mazeWidth: number = parseInt(process.argv[3]);
const mazeHeight: number = parseInt(process.argv[4]);

if (!fs.existsSync(`./maps/${mapFileName}.js`)) {

    terminal.red("\n\n");
    terminal.red("  You did not provide a map name argument. Please choose from:").cyan("  \"map1\", \"map2\", \"map3\"\n\n");
    terminal.white("  Example:  ").cyan("node index.js map2\n\n");
    terminal.white("  You can also supply a custom size to ").cyan("map3\n");
    terminal.white("  Syntax:   node index.js map3 <width> <height>\n");
    terminal.white("  Example:  ").cyan("node index.js map3 12 18\n\n");
   
    process.exit(0);
}

let ratMaze: RatMaze;

if (mazeHeight > 2 && mazeHeight > 2) {

    ratMaze = new RatMaze(mapFileName, mazeWidth, mazeHeight);
}
else {

    ratMaze = new RatMaze(mapFileName);
}

const optimizedPath: IMazeLocation[] = ratMaze.solveMaze();

ratMaze.printMazeTraversal().then(() => {

    terminal.hideCursor();
    console.log("\n");
    console.log(optimizedPath);
    console.log("\n");
    terminal.hideCursor("");  // shows cursor again
});