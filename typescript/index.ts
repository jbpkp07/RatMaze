type RatMaze = new(mapFileName: string, mazeWidth?: number, mazeHeight?: number) => IRatMaze;

const RatMaze: RatMaze = require("./RatMaze.js");
const terminal: any = require("terminal-kit").terminal;

const mapFileName: string = process.argv[2];
const mazeWidth: number = parseInt(process.argv[3]);
const mazeHeight: number = parseInt(process.argv[4]);

let ratMaze: IRatMaze;

if (mazeHeight && mazeHeight) {

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
