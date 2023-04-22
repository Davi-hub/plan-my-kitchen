import { Component, Input, OnInit } from '@angular/core';
import { Point } from 'paper/dist/paper-core';
import { Line } from 'src/app/classes/line';
import { Wall } from 'src/app/classes/wall';
import { RoomService } from '../room.service';

@Component({
  selector: '[app-angles]',
  templateUrl: './angles.component.html',
  styleUrls: ['./angles.component.css']
})

export class AnglesComponent implements OnInit{
  @Input() walls!: Wall[];
  points!: string[];
  angleArray!: any[];
  isLoaded = false;

  constructor(private roomService: RoomService) {
  }

  ngOnInit(): void {
    console.log(this.walls);
    this.angleArray = this.getAngles();
    this.isLoaded = true;
    this.roomService.reDrawAnglesSubject.subscribe((walls: any) => {
      this.walls = walls;
      this.angleArray = this.getAngles();
    });
  }

  getAngles() {
    const angleArray = [];
    for (let i = 0; i < this.walls.length; i++) {
      let j = i - 1;
      if (j === -1) j = this.walls.length - 1;

      const currentWall = this.walls[i].innerLine;
      const nextWall = this.walls[j].innerLine;

      const normal = currentWall.n;
      const startPointsVector = nextWall.P1.subtract(currentWall.P1);

      const dotProduct = normal.dot(startPointsVector);
      const isConcave = dotProduct > 0;

      const pointZero = currentWall.P1;
      const pointOne = pointZero.clone().add(currentWall.v.clone().normalize().multiply(40));
      const pointTwo = pointZero.clone().add(nextWall.v.clone().normalize().multiply(-40));
      const cosAngle = currentWall.v.dot(nextWall.v) / (currentWall.v.length * nextWall.v.length);
      const angleRadians = Math.acos(cosAngle);

      let angleDegrees = parseFloat(((angleRadians * (180 / Math.PI))).toFixed(1));

      let arcType = 0;
      let textPointVector = 20;

      if (isConcave) {
        angleDegrees = 180 + angleDegrees;
        arcType = 1;
        textPointVector = -20;
      } else {
        angleDegrees = 180 - angleDegrees;
      }

      const str = "M" + pointZero.x + "," + pointZero.y + " L" + pointOne.x + "," + pointOne.y + " A40,40 0 " + arcType + ",1 " + pointTwo.x + "," + pointTwo.y + " Z";

      const middlePoint = pointOne.add(pointTwo).divide(2);
      const bisector = new Line(pointZero, middlePoint);
      let textPoint = pointZero.add(bisector.v.normalize().multiply(textPointVector));

      angleArray.push(
        { str: str,
          deg: angleDegrees,
          circleCenter: textPoint,
          inputMode: false
        }
      );
    }
    return angleArray;
  }

  onDone(j: number, deg: number) {
    let i = j - 1;
    if (i === -1) i = this.roomService.pointArray.length - 1;
    const p1 = this.walls[j].startPoint;
    const rotationAngleInDegrees = this.angleArray[j].deg-deg;


    const rotatedWall = this.walls[j].innerLine.v.clone();
    rotatedWall.angle += rotationAngleInDegrees;
    rotatedWall.length = this.walls[j].innerLine.length;

    const rotatedPoint = p1.add(rotatedWall);
    const newLine = new Line(p1, rotatedPoint);
    this.roomService.pointArray[j] = rotatedPoint;
    this.roomService.reDrawSubject.next("");
  }
}
