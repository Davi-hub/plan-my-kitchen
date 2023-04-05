import { Component, Input, OnInit } from '@angular/core';
import { Point } from 'paper/dist/paper-core';
import { Wall } from 'src/app/classes/wall';
import { WallSketch } from 'src/app/classes/wallSketch';
import { SquareRoomService } from '../square-room.service';

@Component({
  selector: '[app-square-room-walls]',
  templateUrl: './square-room-walls.component.html',
  styleUrls: ['./square-room-walls.component.css']
})
export class SquareRoomWallsComponent implements OnInit {
  wallPoints: paper.Point[] = [new Point(100, 100), new Point(600, 100), new Point(600, 600), new Point(100, 600)];
  wallArray: Wall[] = [];

  @Input() walls!: Wall[]

  constructor(public squareRoomService: SquareRoomService) {

  }

  ngOnInit(): void {
    // this.squareRoomService.A = new Point(100, 100);
    // this.squareRoomService.B = new Point(600, 100);
    // this.squareRoomService.C = new Point(600, 600);
    // this.squareRoomService.D = new Point(100, 600);
    // this.squareRoomService.drawWalls();

    console.log(this.walls);

  }

  drawWalls() {
    for (let i = 0; i < this.wallPoints.length; i++) {
      let wall = new Wall(this.wallPoints[i-1], this.wallPoints[i]);
      this.wallArray.push(wall);
    }
  }

}
