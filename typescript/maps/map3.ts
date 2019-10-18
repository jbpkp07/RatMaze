const mazeWidth: number = 12;
const mazeHeight: number = 12;

const startLocation: IMazeLocation = {

    isStart: true,
    xCoord: 0,
    yCoord: 0
};

const endLocation: IMazeLocation = {

    isEnd: true,
    xCoord: 11,
    yCoord: 11
};

const occupiedLocations: IMazeLocation[] = [];

export const map: IMap = {
    mazeWidth,
    mazeHeight,
    startLocation,
    endLocation,
    occupiedLocations,
    randomizeMap: true
};

module.exports = map;