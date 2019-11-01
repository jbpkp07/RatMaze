"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.map = {
    mazeWidth,
    mazeHeight,
    startLocation,
    endLocation,
    occupiedLocations,
    randomizeMap: true
};
module.exports = exports.map;
