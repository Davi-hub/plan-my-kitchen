import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wall } from '../classes/wall';
import { HelpersService } from '../shared/helpers.service';
import { RoomService } from './room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoaded = false;
  walls: Wall[] = [];
  width!: number;
  height: number;
  viewBox!: string;
  scale = 1;
  upDown = 0;
  leftRight = 0;
  reDrawSubs!: Subscription;


  constructor(public roomService: RoomService, private helperService: HelpersService, private cd: ChangeDetectorRef) {
    this.drawWalls();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.viewBox = this.getViewBox();
  }

  ngOnInit(): void {
    this.isLoaded = true;
    this.reDrawSubs = this.roomService.reDrawSubject.subscribe((x) => {
      this.drawWalls();
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
      this.reDrawSubs.unsubscribe();
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

  zoom(value: number) {
    this.scale = this.scale + value;
    this.viewBox = this.getViewBox();
  }

  moveLeftRight(value: number) {
    this.leftRight += value;
    this.viewBox = this.getViewBox();
  }

  moveUpDown(value: number) {
    this.upDown += value;
    this.viewBox = this.getViewBox();
  }

  getViewBox() {
    return this.leftRight + " " + this.upDown + " " +  1/this.scale * this.width + " " + 1/this.scale * this.height;
  }

}
