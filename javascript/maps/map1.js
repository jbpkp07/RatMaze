"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mazeWidth = 6;
const mazeHeight = 6;
const startLocation = {
    isStart: true,
    xCoord: 0,
    yCoord: 1
};
const endLocation = {
    isEnd: true,
    xCoord: 5,
    yCoord: 2
};
const occupiedLocations = [
    { isOccupied: true, xCoord: 1, yCoord: 0 },
    { isOccupied: true, xCoord: 1, yCoord: 3 },
    { isOccupied: true, xCoord: 1, yCoord: 4 },
    { isOccupied: true, xCoord: 2, yCoord: 0 },
    { isOccupied: true, xCoord: 2, yCoord: 1 },
    { isOccupied: true, xCoord: 2, yCoord: 2 },
    { isOccupied: true, xCoord: 2, yCoord: 3 },
    { isOccupied: true, xCoord: 3, yCoord: 5 },
    { isOccupied: true, xCoord: 4, yCoord: 1 },
    { isOccupied: true, xCoord: 4, yCoord: 2 },
    { isOccupied: true, xCoord: 4, yCoord: 3 },
    { isOccupied: true, xCoord: 5, yCoord: 1 },
    { isOccupied: true, xCoord: 5, yCoord: 5 }
];
exports.map = {
    mazeWidth,
    mazeHeight,
    startLocation,
    endLocation,
    occupiedLocations
};
module.exports = exports.map;
