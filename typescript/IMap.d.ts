interface IMap {

    mazeWidth: number;
    mazeHeight: number;
    startLocation: IMazeLocation;
    endLocation: IMazeLocation;
    occupiedLocations: IMazeLocation[];
    randomizeMap?: boolean;
}
