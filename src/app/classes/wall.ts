import { Line } from "./line";
import { Ruler } from "./ruler";

export class Wall {
  innerLine!: Line;
  outherLine!: Line;
  outerStartPoint!: paper.Point;
  outerEndPoint!: paper.Point;
  wall!: string
  ruler!: Ruler;
  isInputMode = false;

  constructor(public startPoint: paper.Point, public endPoint: paper.Point) {
    this.setWall();
  }

  setWall() {
    this.innerLine = new Line(this.startPoint, this.endPoint);
    this.outerStartPoint = this.getOuterStartPoint();
    this.outerEndPoint = this.getOuterEndPoint();
    this.outherLine = new Line(this.outerStartPoint.clone(), this.outerEndPoint.clone());
  }

  reSetWall() {
    this.drawWall();
    this.setRuler();
  }

  getOuterStartPoint() {
    const norm = this.innerLine.n.clone().multiply(10);
    const newPoint = this.startPoint.clone().add(norm);
    return newPoint;
  }

  getOuterEndPoint() {
    const norm = this.innerLine.n.clone().multiply(10);
    const newPoint = this.endPoint.clone().add(norm);
    return newPoint;
  }

  drawWall() {
    this.wall =
      this.startPoint.x + ',' + this.startPoint.y + ' ' +
      this.endPoint.x + ',' + this.endPoint.y + ' ' +
      this.outerEndPoint.x + ',' + this.outerEndPoint.y + ' ' +
      this.outerStartPoint.x + ',' + this.outerStartPoint.y
    ;
  }

  setRuler() {
    this.ruler = new Ruler(this.innerLine);
  }
}
