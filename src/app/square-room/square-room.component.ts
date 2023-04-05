import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Point } from 'paper/dist/paper-core';
import { Line } from '../classes/line';
import { Wall } from '../classes/wall';
import { HelpersService } from '../shared/helpers.service';
import { SquareRoomService } from './square-room.service';

@Component({
  selector: 'app-square-room',
  templateUrl: './square-room.component.html',
  styleUrls: ['./square-room.component.css']
})
export class SquareRoomComponent implements OnInit {
  isLoaded = false;
  walls: Wall[] = [
    // new Wall(this.squareRoomService.pointArray[0], this.squareRoomService.pointArray[1]),
    // new Wall(this.squareRoomService.pointArray[1], this.squareRoomService.pointArray[2]),
    // new Wall(this.squareRoomService.pointArray[2], this.squareRoomService.pointArray[3]),
    // new Wall(this.squareRoomService.pointArray[3], this.squareRoomService.pointArray[4]),
    // new Wall(this.squareRoomService.pointArray[4], this.squareRoomService.pointArray[0]),
  ];


  constructor(public squareRoomService: SquareRoomService) {
    this.drawWalls();
   }

  ngOnInit(): void {

    console.log(this.walls);
    this.isLoaded = true;
    this.squareRoomService.reDrawSubject.subscribe(() => {
      this.drawWalls();
      console.log('lefut');


    });
  }

  drawWalls() {
    const newWalls: Wall[] = [];
    for (let i = 0; i < this.squareRoomService.pointArray.length; i++) {
      let a = i-1;
      let b = i;
      if(a === -1) a = this.squareRoomService.pointArray.length-1;
      const wall = new Wall(this.squareRoomService.pointArray[a], this.squareRoomService.pointArray[b]);
      newWalls.push(wall);
    }

    this.walls = newWalls;
  }



}
