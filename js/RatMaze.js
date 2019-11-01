"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_table_1 = __importDefault(require("cli-table"));
const terminal_kit_1 = require("terminal-kit");
const VisitedLocation_js_1 = require("./VisitedLocation.js");
class RatMaze {
    constructor(mapFileName, mazeWidth, mazeHeight) {
        this.visitedLocations = [];
        this.allMazeLocations = [];
        this.traveledPath = [];
        this.optimizedPath = [];
        this.hasFinished = false;
        this.map = require(`./maps/${mapFileName}`);
        if (typeof mazeWidth === "number" && typeof mazeHeight === "number") {
            this.map.mazeWidth = mazeWidth;
            this.map.mazeHeight = mazeHeight;
            this.map.endLocation.xCoord = mazeWidth - 1;
            this.map.endLocation.yCoord = mazeHeight - 1;
        }
        this.playerLocation = {
            isPlayer: true,
            xCoord: this.map.startLocation.xCoord,
            yCoord: this.map.startLocation.yCoord
        };
        this.prepareConsole();
    }
    async printMazeTraversal() {
        const allPromises = [];
        return new Promise((resolve) => {
            let count = 1;
            for (const location of this.optimizedPath) {
                const promise = new Promise((resolveInner) => {
                    setTimeout(() => {
                        this.playerLocation.xCoord = location.xCoord;
                        this.playerLocation.yCoord = location.yCoord;
                        this.printMazeOnce();
                        resolveInner();
                    }, count * 250);
                });
                allPromises.push(promise);
                count++;
            }
            Promise.all(allPromises).then(() => {
                resolve();
            });
        });
    }
    solveMaze() {
        if ("randomizeMap" in this.map) {
            this.visitedLocations = [];
            this.randomizeMap();
            this.printMazeOnce();
        }
        this.solveMazeAttempt();
        if (this.optimizedPath.length === 0) { // unsolveable map
            this.solveMaze(); // try another random map that is solveable
        }
        return this.optimizedPath;
    }
    randomizeMap() {
        this.map.occupiedLocations = [];
        for (let i = 0; i < Math.floor((this.map.mazeHeight * this.map.mazeWidth) / 2); i++) {
            let isValidLocation = false;
            const randomLocation = {
                isOccupied: true,
                xCoord: Math.floor(Math.random() * this.map.mazeWidth),
                yCoord: Math.floor(Math.random() * this.map.mazeHeight)
            };
            while (!isValidLocation) {
                if ((this.map.startLocation.xCoord !== randomLocation.xCoord || this.map.startLocation.yCoord !== randomLocation.yCoord) &&
                    (this.map.endLocation.xCoord !== randomLocation.xCoord || this.map.endLocation.yCoord !== randomLocation.yCoord)) {
                    isValidLocation = true;
                }
                else {
                    randomLocation.xCoord = Math.floor(Math.random() * this.map.mazeWidth);
                    randomLocation.yCoord = Math.floor(Math.random() * this.map.mazeHeight);
                }
            }
            this.map.occupiedLocations.push(randomLocation);
        }
    }
    solveMazeAttempt(currentPosition = this.playerLocation) {
        const currentLocation = new VisitedLocation_js_1.VisitedLocation(currentPosition.xCoord, currentPosition.yCoord);
        this.traveledPath.push(currentLocation);
        this.visitedLocations.push(currentLocation);
        if (currentPosition.xCoord === this.map.endLocation.xCoord && currentPosition.yCoord === this.map.endLocation.yCoord) {
            this.hasFinished = true;
            this.setOptimizedPath();
            return;
        }
        let nextLocation;
        // move down ------------------------------------------------------------
        nextLocation = new VisitedLocation_js_1.VisitedLocation(currentPosition.xCoord, currentPosition.yCoord + 1);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        // move right ------------------------------------------------------------
        nextLocation = new VisitedLocation_js_1.VisitedLocation(currentPosition.xCoord + 1, currentPosition.yCoord);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        // move up ------------------------------------------------------------
        nextLocation = new VisitedLocation_js_1.VisitedLocation(currentPosition.xCoord, currentPosition.yCoord - 1);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        // move left ------------------------------------------------------------
        nextLocation = new VisitedLocation_js_1.VisitedLocation(currentPosition.xCoord - 1, currentPosition.yCoord);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        if (!this.hasFinished) {
            this.traveledPath.pop();
        }
    }
    printMazeOnce() {
        this.updateAllMazeLocations();
        terminal_kit_1.terminal.restoreCursor();
        const tableData = [];
        const colAligns = ["middle"];
        let tableRow = [];
        let tableRowNum = 0;
        for (const location of this.allMazeLocations) {
            if (location.yCoord !== tableRowNum) {
                tableData.push(tableRow);
                tableRow = [];
                tableRowNum++;
            }
            if (location.isOccupied === true) {
                tableRow.push("■");
            }
            else if (location.isStart === true) {
                tableRow.push("S");
            }
            else if (location.isEnd === true) {
                tableRow.push("E");
            }
            else if (location.isPlayer === true) {
                tableRow.push("▲");
            }
            else {
                tableRow.push(" ");
            }
        }
        if (tableRow.length > 0) {
            tableData.push(tableRow);
        }
        const compact = false;
        const tableConfigObj = {
            colAligns,
            style: { "padding-left": 1, "padding-right": 1, "border": ["cyan"], compact }
        };
        const table = new cli_table_1.default(tableConfigObj);
        tableData.forEach((row) => table.push(row));
        const tableSTR = table.toString();
        const tableSTRIndented = `    ${tableSTR.replace(/\n/g, "\n    ")}\n\n`;
        terminal_kit_1.terminal(tableSTRIndented);
    }
    updateAllMazeLocations() {
        this.map.occupiedLocations.push(this.playerLocation, this.map.startLocation, this.map.endLocation);
        this.allMazeLocations = [];
        let xCoord;
        let yCoord;
        const predicate = (location) => location.xCoord === xCoord && location.yCoord === yCoord;
        for (yCoord = 0; yCoord < this.map.mazeHeight; yCoord++) {
            for (xCoord = 0; xCoord < this.map.mazeWidth; xCoord++) {
                const occupiedLocation = this.map.occupiedLocations.find(predicate);
                if (occupiedLocation) {
                    this.allMazeLocations.push(occupiedLocation);
                }
                else {
                    const availableLocation = {
                        xCoord,
                        yCoord
                    };
                    this.allMazeLocations.push(availableLocation);
                }
            }
        }
    }
    canTravelToLocation(nextLocation) {
        if (nextLocation.xCoord < 0 || nextLocation.xCoord >= this.map.mazeWidth) {
            return false;
        }
        if (nextLocation.yCoord < 0 || nextLocation.yCoord >= this.map.mazeHeight) {
            return false;
        }
        if (this.allMazeLocations.length === 0) {
            this.updateAllMazeLocations();
        }
        const predicate = (location) => location.xCoord === nextLocation.xCoord && location.yCoord === nextLocation.yCoord;
        let locationToCheck = this.allMazeLocations.find(predicate);
        if (locationToCheck.isOccupied === true) {
            return false;
        }
        locationToCheck = this.visitedLocations.find(predicate);
        if (locationToCheck) {
            return false;
        }
        return true;
    }
    setOptimizedPath() {
        for (let i = 0; i < this.traveledPath.length; i++) {
            const current = this.traveledPath[i];
            const j = i - 3;
            if (j >= 0) {
                const past = this.traveledPath[j];
                const diffX = Math.abs(current.xCoord - past.xCoord);
                const diffY = Math.abs(current.yCoord - past.yCoord);
                const diffTotal = diffX + diffY;
                if (diffTotal === 1) {
                    this.traveledPath.splice(j + 1, 2);
                    this.setOptimizedPath();
                }
            }
        }
        this.optimizedPath = this.traveledPath;
    }
    prepareConsole() {
        terminal_kit_1.terminal.reset();
        terminal_kit_1.terminal("\n\n");
        terminal_kit_1.terminal.saveCursor();
    }
}
exports.RatMaze = RatMaze;
