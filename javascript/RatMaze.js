const terminal = require("terminal-kit").terminal;
const Table = require("cli-table");
const VisitedLocation = require("./VisitedLocation.js");
class RatMaze {
    constructor(mapFileName) {
        this.visitedLocations = [];
        this.allMazeLocations = [];
        this.traveledPath = [];
        this.optimizedPath = [];
        this.hasFinished = false;
        this.map = require(`./maps/${mapFileName}`);
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
                    }, count * 500);
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
        if (this.map.randomizeMap) {
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
        const currentLocation = new VisitedLocation(currentPosition.xCoord, currentPosition.yCoord);
        this.traveledPath.push(currentLocation);
        this.visitedLocations.push(currentLocation);
        if (currentPosition.xCoord === this.map.endLocation.xCoord && currentPosition.yCoord === this.map.endLocation.yCoord) {
            this.hasFinished = true;
            this.setOptimizedPath();
            return;
        }
        let nextLocation;
        // move up ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord, currentPosition.yCoord - 1);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        // move right ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord + 1, currentPosition.yCoord);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        // move down ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord, currentPosition.yCoord + 1);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        // move left ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord - 1, currentPosition.yCoord);
        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {
            this.solveMazeAttempt(nextLocation);
        }
        if (!this.hasFinished) {
            this.traveledPath.pop();
        }
    }
    printMazeOnce() {
        this.updateAllMazeLocations();
        terminal.restoreCursor();
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
        const table = new Table(tableConfigObj);
        tableData.forEach((row) => table.push(row));
        const tableSTR = table.toString();
        const tableSTRIndented = `    ${tableSTR.replace(/\n/g, "\n    ")}\n\n`;
        terminal(tableSTRIndented);
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
        if (typeof locationToCheck !== "undefined") {
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
        terminal.reset();
        terminal("\n\n");
        terminal.saveCursor();
    }
}
module.exports = RatMaze;
