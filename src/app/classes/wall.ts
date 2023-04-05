import { Point } from "paper/dist/paper-core";
import { Line } from "./line";
import { Ruler } from "./ruler";

export class Wall {
  innerLine!: Line;
  outerStartPoint!: paper.Point;
  outerEndPoint!: paper.Point;
  wall!: string
  ruler!: Ruler;
  isInputMode = true;

  constructor(private startPoint: paper.Point, private endPoint: paper.Point) {
    this.setWall();
    this.drawWall();
    this.setRuler();
  }

  setWall() {
    this.innerLine = new Line(this.startPoint, this.endPoint);
    this.outerStartPoint = this.getOuterStartPoint();
    this.outerEndPoint = this.getOuterEndPoint();
    this.drawWall();
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

  getOuterStartPoint() {
    const norm = this.innerLine.n.clone().multiply(10);
    const dir = this.innerLine.v.clone().normalize().multiply(-10);
    const newPoint = this.startPoint.clone().add(norm).add(dir);
    return newPoint;
  }

  getOuterEndPoint() {
    const norm = this.innerLine.n.clone().multiply(10);
    const dir = this.innerLine.v.clone().normalize().multiply(10);
    const newPoint = this.endPoint.clone().add(norm).add(dir);
    return newPoint;
  }
}
