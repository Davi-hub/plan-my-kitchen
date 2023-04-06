import { Component, ElementRef, OnInit } from '@angular/core';
import { Wall } from '../classes/wall';
import { HelpersService } from '../shared/helpers.service';
import { RoomService } from './room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  isLoaded = false;
  walls: Wall[] = [];


  constructor(public roomService: RoomService, private helperService: HelpersService) {
    this.drawWalls();
  }

  ngOnInit(): void {
    this.isLoaded = true;
    this.roomService.reDrawSubject.subscribe((x) => {
      this.drawWalls();
    });
  }

  drawWalls() {
    const newWalls: Wall[] = [];
    for (let i = 0; i < this.roomService.pointArray.length; i++) {
      let a = i-1;
      let b = i;
      if(a === -1) a = this.roomService.pointArray.length-1;
      const wall = new Wall(this.roomService.pointArray[a], this.roomService.pointArray[b]);
      newWalls.push(wall);
    }
    this.reCalcOuterPoints(newWalls);
    this.walls = newWalls;
  }

  reCalcOuterPoints(walls: Wall[]) {
    for (let j = 0; j < walls.length; j++) {
      let i = j-1;
      if (i == -1) i = walls.length-1;
      let k = j+1;
      if (k == walls.length) k = 0;
      let startInter = this.helperService.getIntersection(walls[i].outherLine, walls[j].outherLine);
      let endInter = this.helperService.getIntersection(walls[j].outherLine, walls[k].outherLine);
      console.log(walls[j].outerStartPoint);
      console.log(startInter);
      console.log(walls[j].outerEndPoint);
      console.log(endInter);
      walls[j].outerStartPoint = startInter;
      walls[j].outerEndPoint = endInter;
      walls[j].reSetWall();
    }
  }
}
