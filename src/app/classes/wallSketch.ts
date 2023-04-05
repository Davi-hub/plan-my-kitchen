import { Point } from "paper";
import { HelpersService } from "../shared/helpers.service";
import { Line } from "./line";

export class WallSketch {
  pointArray!: paper.Point[];
  innerLines!: Line[];
  outerPoints!: paper.Point[];

  constructor(private initialPointArray: paper.Point[]) {}

  drawWalls() {
    this.setInnerLines();
  }

  setInnerLines() {
    for (let i = 0; i < this.pointArray.length; i++) {
      const line = new Line(this.pointArray[i-1], this.pointArray[i]);
      this.innerLines.push(line);
    }
  };

  setOuterPoints() {
    for (let i = 0; i < this.pointArray.length; i++) {
      const element = this.pointArray[i];

    }
  }

}
