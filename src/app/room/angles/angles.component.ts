import { Component, Input, OnInit } from '@angular/core';
import { Point } from 'paper/dist/paper-core';
import { Line } from 'src/app/classes/line';
import { Wall } from 'src/app/classes/wall';
import { AngleObject } from 'src/app/interfaces/angle-object';
import { RoomService } from '../room.service';

@Component({
  selector: '[app-angles]',
  templateUrl: './angles.component.html',
  styleUrls: ['./angles.component.css']
})

export class AnglesComponent implements OnInit{
  @Input() walls!: Wall[];
  points!: string[];
  angleArray!: AngleObject[];
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
    const angleObjectArray: AngleObject[] = [];
    this.creatreAngleObjArr(angleObjectArray);
    this.correctAngles(angleObjectArray);
    this.finalCalcsAngleObjArr(angleObjectArray);
    return angleObjectArray;
  }

  creatreAngleObjArr (arr: any[]) {
    for (let i = 0; i < this.walls.length; i++) {
      let j = i - 1;
      if (j === -1) j = this.walls.length - 1;

      const currentWall = this.walls[i].innerLine;
      const nextWall = this.walls[j].innerLine;

      const normal = currentWall.n;
      const startPointsVector = nextWall.P1.subtract(currentWall.P1);

      const dotProduct = normal.dot(startPointsVector);
      const isConcave = dotProduct >= 0;

      const pointZero = currentWall.P1;
      const pointOne = pointZero.clone().add(currentWall.v.clone().normalize().multiply(40));
      const pointTwo = pointZero.clone().add(nextWall.v.clone().normalize().multiply(-40));
      const cosAngle = Math.max(Math.min(currentWall.v.dot(nextWall.v) / (currentWall.v.length * nextWall.v.length), 1), -1);

      let angleRadians = Math.acos(cosAngle);
      angleRadians = Math.max(Math.min(angleRadians, Math.PI), 0);

      if (isConcave) {
        angleRadians = Math.PI + angleRadians;
      } else {
        angleRadians = Math.PI - angleRadians;
      }

      let rawDeg = parseFloat(((angleRadians * (180 / Math.PI))).toFixed(10));
      let roundedDeg = parseFloat(((angleRadians * (180 / Math.PI))).toFixed(0));


      arr.push(
        {
          isConcave: isConcave,
          pointZero: pointZero,
          pointOne: pointOne,
          pointTwo: pointTwo,
          rawDeg: rawDeg,
          roundedDeg: roundedDeg,
          str: '',
          circleCenter: undefined,
          inputMode: false
        }
        );
    }
  }

  correctAngles(arr: any[]) {
    let sum = 0;
    const correctSum = (arr.length-2)*180;
    for (let i = 0; i < arr.length; i++) {
      sum = sum + arr[i].roundedDeg;
    }
    if (sum != correctSum) {
      const tempArray = [];
      for (let i = 0; i < arr.length; i++) {
        let num = Math.abs(arr[i].rawDeg - arr[i].roundedDeg);
        tempArray.push(num);
      }
      const index = tempArray.indexOf(Math.max(...tempArray));
      if (sum < 540) arr[index].roundedDeg++;
      if (sum > 540) arr[index].roundedDeg--;

      console.log(sum);
      console.log(tempArray);
      console.log(arr);
    }
  }

  finalCalcsAngleObjArr(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      let arcType = 0;
      let textPointVector = 20;

      if (arr[i].isConcave) {
        arcType = 1;
        textPointVector = -20;
      }

      const str: string = "M" + arr[i].pointZero.x + "," + arr[i].pointZero.y + " L" + arr[i].pointOne.x + "," + arr[i].pointOne.y + " A40,40 0 " + arcType + ",1 " + arr[i].pointTwo.x + "," + arr[i].pointTwo.y + " Z";

      const middlePoint = arr[i].pointOne.add(arr[i].pointTwo).divide(2);
      let pointZero: paper.Point = arr[i].pointZero;
      let bisector = new Line(pointZero, middlePoint);
      if(bisector.length == 0) bisector = new Line(pointZero, pointZero.add(this.walls[i].innerLine.n));

      let textPoint: any = arr[i].pointZero.add(bisector.v.normalize().multiply(textPointVector));

      arr[i] = {
        ...arr[i],
        str: str,
        circleCenter: textPoint,
        inputMode: false
      }
    }
  }

  onDone(j: number, deg: number) {
    let i = j - 1;
    if (i === -1) i = this.roomService.pointArray.length - 1;
    const p1 = this.walls[j].startPoint;
    const rotationAngleInDegrees = this.angleArray[j].roundedDeg-deg;


    const rotatedWall = this.walls[j].innerLine.v.clone();
    rotatedWall.angle += rotationAngleInDegrees;
    rotatedWall.length = this.walls[j].innerLine.length;

    const rotatedPoint = p1.add(rotatedWall);
    const newLine = new Line(p1, rotatedPoint);
    this.roomService.pointArray[j] = rotatedPoint;
    this.roomService.reDrawSubject.next("");
  }
}
