import { Component, Input, OnInit } from '@angular/core';
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
    this.angleArray = this.getPoints();
    this.isLoaded = true;
    this.roomService.reDrawSubject.subscribe(() => {
      this.angleArray = this.getPoints();
    });
  }

  getPoints() {
    const angleArray = [];
    for (let i = 0; i < this.walls.length; i++) {
      let j = i - 1;
      if (j === -1) j = this.walls.length-1;
      const pointZero = this.walls[i].innerLine.P1;
      const pointOne = pointZero.clone().add(this.walls[i].innerLine.v.clone().normalize().multiply(40));
      const pointTwo = pointZero.clone().add(this.walls[j].innerLine.v.clone().normalize().multiply(-40));
      const dotProduct = this.walls[i].innerLine.v.dot(this.walls[j].innerLine.v);
      const line1Length = this.walls[i].innerLine.v.length;
      const line2Length = this.walls[j].innerLine.v.length;

      const cosAngle = dotProduct / (line1Length * line2Length);
      const angleRadians = Math.acos(cosAngle);

      const angleDegrees = (angleRadians * (180 / Math.PI));
      let a = 0;
      if (angleDegrees > 180) a = 0;
      const str = "M" + pointZero.x + "," + pointZero.y + " L" + pointOne.x + "," + pointOne.y + " A40,40 0 " + a +",1 " + pointTwo.x + "," + pointTwo.y + " Z";
      angleArray.push({str: str, deg: angleDegrees, point: pointZero});
    }
    return angleArray;
  }
}
