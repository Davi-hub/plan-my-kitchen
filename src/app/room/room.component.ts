import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  isDragging: boolean = false;
  roomMouseMoveListener: (() => void) | undefined;
  @ViewChild('plan', { static: true }) svgElRef!: ElementRef<SVGElement>;
  svgEl!: SVGElement;
  svgElArr!: number[];
  startX!: number;
  startY!: number;
  moveHelper;


  constructor(
    public roomService: RoomService,
    private helperService: HelpersService,
    private renderer: Renderer2
  ) {
    this.drawWalls();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.viewBox = this.getViewBox();
    this.moveHelper =
      this.width*-10 + "," + this.height*-10 + " " +
      this.width*10 + "," + this.height*-10 + " " +
      this.width*10 + "," + this.height*10 + " " +
      this.width*-10 + "," +this.height*10;
  }

  ngOnInit(): void {
    this.isLoaded = true;
    // this.svgEl = this.svgElRef.nativeElement;
    this.reDrawSubs = this.roomService.reDrawSubject.subscribe((x) => {
      this.drawWalls();
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
      if (startInter) {
        walls[j].outerStartPoint = startInter;
      }
      if (endInter) {
        walls[j].outerEndPoint = endInter;
      }
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

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    console.log(this.leftRight);
    console.log(this.upDown);
    this.startX = event.clientX*(1/this.scale)+this.leftRight;
    this.startY = event.clientY*(1/this.scale)+this.upDown;
    this.isDragging = true;
    this.activateMoveListener('mousemove');
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.startX = event.touches[0].clientX*(1/this.scale)+this.leftRight;
    this.startY = event.touches[0].clientY*(1/this.scale)+this.upDown;
    this.isDragging = true;
    this.activateMoveListener('touchmove');
  }

  activateMoveListener(moveType: string) {
    this.roomMouseMoveListener = this.renderer.listen(window, moveType, (event) => {
      if (this.isDragging) {
        if (moveType == 'mousemove') {
          console.log(event.pageX);
          console.log(event.pageY);

          this.leftRight = (this.startX-event.pageX*(1/this.scale));
          this.upDown = (this.startY-event.pageY*(1/this.scale));
        } else {
          const touch = event.touches[0];
          this.leftRight = this.startX-(touch.pageX*(1/this.scale));
          this.upDown = this.startY-(touch.pageY*(1/this.scale));
        }
        this.viewBox = this.getViewBox();
      }
    });
  }

  onMouseUp() {
    this.stopDragging();
  }

  onTouchEnd() {
    this.stopDragging();
  }

  stopDragging() {
    this.isDragging = false;
    if (this.roomMouseMoveListener) {
      this.roomMouseMoveListener();
    }
  }

}
