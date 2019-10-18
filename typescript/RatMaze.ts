import Table from "cli-table";
import { terminal } from "terminal-kit";

import { VisitedLocation } from "./VisitedLocation.js";


export class RatMaze {

    private readonly map: IMap;

    private readonly playerLocation: IMazeLocation;

    private visitedLocations: IMazeLocation[] = [];

    private allMazeLocations: IMazeLocation[] = [];

    private readonly traveledPath: IMazeLocation[] = [];

    private optimizedPath: IMazeLocation[] = [];

    private hasFinished: boolean = false;

    public constructor(mapFileName: string, mazeWidth?: number, mazeHeight?: number) {

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

    public async printMazeTraversal(): Promise<null> {

        const allPromises: Promise<void>[] = [];

        return new Promise((resolve: Function): void => {

            let count: number = 1;

            for (const location of this.optimizedPath) {

                const promise: Promise<void> = new Promise((resolveInner: Function): void => {

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

    public solveMaze(): IMazeLocation[] {

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

    private randomizeMap(): void {

        this.map.occupiedLocations = [];

        for (let i: number = 0; i < Math.floor((this.map.mazeHeight * this.map.mazeWidth) / 2); i++) {

            let isValidLocation: boolean = false;

            const randomLocation: IMazeLocation = {

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

    private solveMazeAttempt(currentPosition: IMazeLocation = this.playerLocation): void {

        const currentLocation: IMazeLocation = new VisitedLocation(currentPosition.xCoord, currentPosition.yCoord);

        this.traveledPath.push(currentLocation);

        this.visitedLocations.push(currentLocation);

        if (currentPosition.xCoord === this.map.endLocation.xCoord && currentPosition.yCoord === this.map.endLocation.yCoord) {

            this.hasFinished = true;

            this.setOptimizedPath();

            return;
        }

        let nextLocation: IMazeLocation;

        // move down ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord, currentPosition.yCoord + 1);

        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {

            this.solveMazeAttempt(nextLocation);
        }

        // move right ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord + 1, currentPosition.yCoord);

        if (!this.hasFinished && this.canTravelToLocation(nextLocation)) {

            this.solveMazeAttempt(nextLocation);
        }

        // move up ------------------------------------------------------------
        nextLocation = new VisitedLocation(currentPosition.xCoord, currentPosition.yCoord - 1);

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

    private printMazeOnce(): void {

        this.updateAllMazeLocations();

        terminal.restoreCursor();

        const tableData: string[][] = [];
        const colAligns: string[] = ["middle"];

        let tableRow: string[] = [];
        let tableRowNum: number = 0;

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

        const compact: boolean = false;

        const tableConfigObj: object = {
            colAligns,
            style: { "padding-left": 1, "padding-right": 1, "border": ["cyan"], compact }
        };

        const table: Table = new Table(tableConfigObj);

        tableData.forEach((row: string[]) => table.push(row));

        const tableSTR: string = table.toString();

        const tableSTRIndented: string = `    ${tableSTR.replace(/\n/g, "\n    ")}\n\n`;

        terminal(tableSTRIndented);
    }

    private updateAllMazeLocations(): void {

        this.map.occupiedLocations.push(this.playerLocation, this.map.startLocation, this.map.endLocation);

        this.allMazeLocations = [];

        let xCoord: number;
        let yCoord: number;

        const predicate: any = (location: IMazeLocation): boolean => location.xCoord === xCoord && location.yCoord === yCoord;

        for (yCoord = 0; yCoord < this.map.mazeHeight; yCoord++) {

            for (xCoord = 0; xCoord < this.map.mazeWidth; xCoord++) {

                const occupiedLocation: any = this.map.occupiedLocations.find(predicate);

                if (occupiedLocation) {

                    this.allMazeLocations.push(occupiedLocation);
                }
                else {

                    const availableLocation: IMazeLocation = {
                        xCoord,
                        yCoord
                    };

                    this.allMazeLocations.push(availableLocation);
                }
            }
        }
    }

    private canTravelToLocation(nextLocation: IMazeLocation): boolean {

        if (nextLocation.xCoord < 0 || nextLocation.xCoord >= this.map.mazeWidth) {

            return false;
        }

        if (nextLocation.yCoord < 0 || nextLocation.yCoord >= this.map.mazeHeight) {

            return false;
        }

        if (this.allMazeLocations.length === 0) {

            this.updateAllMazeLocations();
        }

        const predicate: any = (location: IMazeLocation): boolean => location.xCoord === nextLocation.xCoord && location.yCoord === nextLocation.yCoord;

        let locationToCheck: any = this.allMazeLocations.find(predicate);

        if (locationToCheck.isOccupied === true) {

            return false;
        }

        locationToCheck = this.visitedLocations.find(predicate);

        if (locationToCheck) {

            return false;
        }

        return true;
    }

    private setOptimizedPath(): void {

        for (let i: number = 0; i < this.traveledPath.length; i++) {

            const current: IMazeLocation = this.traveledPath[i];

            const j: number = i - 3;

            if (j >= 0) {

                const past: IMazeLocation = this.traveledPath[j];

                const diffX: number = Math.abs(current.xCoord - past.xCoord);
                const diffY: number = Math.abs(current.yCoord - past.yCoord);

                const diffTotal: number = diffX + diffY;

                if (diffTotal === 1) {

                    this.traveledPath.splice(j + 1, 2);

                    this.setOptimizedPath();
                }
            }
        }

        this.optimizedPath = this.traveledPath;
    }

    private prepareConsole(): void {

        terminal.reset();
        terminal("\n\n");
        terminal.saveCursor();
    }
}