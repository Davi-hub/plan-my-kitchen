import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RoomService } from '../room.service';

@Component({
  selector: '[app-resize]',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.css']
})
export class ResizeComponent implements OnInit {
  @ViewChild('svgEl', { static: true })
  svgElRef!: ElementRef<SVGElement>;
  svgEl!: SVGElement;
  svgElArr!: number[];
  draggingPoint: paper.Point | null = null;
  isDraggingPoint = false;
  private mouseMoveListener: (() => void) | undefined;
  private isDragging = false;
  startX!: number;
  startY!: number;
  @Input() scale!: number;
  @Input() UpDown!: number;
  @Input() leftRight!: number;

  constructor(private renderer: Renderer2, public roomService: RoomService) { }

  ngOnInit(): void {
    this.svgEl = this.svgElRef.nativeElement;
  }

  onMouseDown(event: MouseEvent, point: paper.Point) {
    event.preventDefault();
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isDragging = true;
    this.activateMoveListener('mousemove', point);
  }

  onTouchStart(event: TouchEvent, point: paper.Point) {
    event.preventDefault();
    this.isDragging = true;
    this.activateMoveListener('touchmove', point);
  }

  activateMoveListener(moveType: string, point: paper.Point) {
    console.log(point);
    this.mouseMoveListener = this.renderer.listen(window, moveType, (event) => {
      if (this.isDragging) {
        this.svgElArr = [
          this.svgEl.parentElement!.parentElement!.getBoundingClientRect().x,
          this.svgEl.parentElement!.parentElement!.getBoundingClientRect().y
        ];
        console.log(this.svgElArr);

        if (moveType == 'mousemove') {
          console.log(event);
          console.log(this.svgElArr);
          point.x = event.pageX*(1/this.scale)+this.leftRight;
          point.y = event.pageY*(1/this.scale)+this.UpDown;
        } else {
          const touch = event.touches[0];
          point.x = touch.pageX-this.svgElArr[0];
          point.y = touch.pageY-this.svgElArr[1];
        }
        this.roomService.reDrawSubject.next("");
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
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }
}
