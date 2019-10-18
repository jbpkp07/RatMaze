export class VisitedLocation implements IMazeLocation {

    public xCoord: number;
    public yCoord: number;

    public constructor(xCoord: number, yCoord: number) {
        
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }
}