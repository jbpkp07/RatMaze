interface IRatMaze {

    solveMaze(): IMazeLocation[];
    printMazeTraversal(): Promise<null>;
}
