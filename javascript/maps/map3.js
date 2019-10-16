const mazeWidth = 12;
const mazeHeight = 12;
const startLocation = {
    isStart: true,
    xCoord: 0,
    yCoord: 0
};
const endLocation = {
    isEnd: true,
    xCoord: 11,
    yCoord: 11
};
const occupiedLocations = [];
const map = {
    mazeWidth,
    mazeHeight,
    startLocation,
    endLocation,
    occupiedLocations,
    randomizeMap: true
};
module.exports = map;
