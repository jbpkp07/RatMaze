type RatMaze = new(mapFileName: string) => IRatMaze;

const RatMaze: RatMaze = require("./RatMaze.js");
const terminal: any = require("terminal-kit").terminal;

const mapFileName: string = process.argv[2];

const ratMaze: IRatMaze = new RatMaze(mapFileName);

const optimizedPath: IMazeLocation[] = ratMaze.solveMaze();

ratMaze.printMazeTraversal().then(() => {

    terminal.hideCursor();
    console.log("\n");
    console.log(optimizedPath);
    console.log("\n");
    terminal.hideCursor("");  // shows cursor again
});
