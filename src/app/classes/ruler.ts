import { Line } from "./line";

export class Ruler {
  inputPositionPoint;
  textPositionPoint;

  constructor(private baseLine: Line) {
    this.textPositionPoint = {...this.getInputVector(50, 0).point};
    this.inputPositionPoint = this.getInputVector(55, 25).point;
  }

  drawRuler(width: number){
    // return this.drawHalfRuler(this.baseLine.P1, width)+' '+this.drawHalfRuler(this.baseLine.P2, width)+' Z';
    return this.drawWholeRuler(this.baseLine.P1, width)+' Z';
  }

  drawHalfRuler(p: paper.Point, width: number) {
    let d: number = 1;
    if (p === this.baseLine.P2) {
      d = -1
    }
    let vector1 = this.baseLine.n.multiply(20);
    let vector2 = this.baseLine.n.multiply(20);
    let vector3 = this.baseLine.n.multiply(20);
    let vector4 = this.baseLine.v.multiply(20);
    vector1.length = width;
    vector2.length = width + 5;
    vector3.length = width + 10;
    vector4.length = d * (this.baseLine.length/2 - 25);
    let p1: paper.Point = p.clone().add(vector1);
    let p2: paper.Point = p.clone().add(vector2);
    let p3: paper.Point = p.clone().add(vector3);
    let p4: paper.Point = p2.clone().add(vector4);
    let ruler = 'M' + p2.x + ' ' + p2.y + ' L' + p1.x + ' ' + p1.y + ' L' + p3.x + ' ' + p3.y +
    'M' + p2.x + ' ' + p2.y + ' L' + p4.x + ' ' + p4.y;
    return ruler;
  }

  drawWholeRuler(p: paper.Point, width: number) {
    let vector1 = this.baseLine.n.multiply(20);
    let vector2 = this.baseLine.n.multiply(20);
    let vector3 = this.baseLine.n.multiply(20);
    let vector4 = this.baseLine.v.multiply(20);
    vector1.length = width;
    vector2.length = width + 5;
    vector3.length = width + 10;
    vector4.length = (this.baseLine.length);
    let p1: paper.Point = p.clone().add(vector1);
    let p2: paper.Point = p.clone().add(vector2);
    let p3: paper.Point = p.clone().add(vector3);
    let p4: paper.Point = p2.clone().add(vector4);
    let p5: paper.Point = p4.clone().subtract(vector1.clone().normalize().multiply(5));
    let p6: paper.Point = p4.clone().add(vector2.clone().normalize().multiply(5));
    let ruler = 'M' + p2.x + ' ' + p2.y + ' L' + p1.x + ' ' + p1.y + ' L' + p3.x + ' ' + p3.y +
    'M' + p2.x + ' ' + p2.y + ' L' + p4.x + ' ' + p4.y + ' M' + p5.x + ' ' + p5.y + ' L' + p6.x + ' ' + p6.y;
    return ruler;
  }

  getInputVector(width: number, space: number) {
    let vector = this.baseLine.n;
    vector.length = width;
    let p: paper.Point = this.baseLine.P1.clone().add(vector);

    let vector2 = this.baseLine.v;
    if (this.baseLine.length/2 < space) {
      space = 0;
    }
    vector2.length = (this.baseLine.length/2 - space);
    let inputPoint: paper.Point = p.clone().add(vector2);
    return {point: inputPoint, angle: vector2.angle};
  }
}
