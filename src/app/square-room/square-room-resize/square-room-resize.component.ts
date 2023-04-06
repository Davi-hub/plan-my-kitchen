import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SquareRoomService } from '../square-room.service';

@Component({
  selector: '[app-square-room-resize]',
  templateUrl: './square-room-resize.component.html',
  styleUrls: ['./square-room-resize.component.css']
})
export class SquareRoomResizeComponent implements OnInit {
  @ViewChild('svgEl', { static: true })
  svgElRef!: ElementRef<SVGElement>;
  svgEl!: SVGElement;
  svgElArr!: number[];
  draggingPoint: paper.Point | null = null;
  isDraggingPoint = false;
  private mouseMoveListener: (() => void) | undefined;
  private isDragging = false;

  constructor(private renderer: Renderer2, public squareRoomService: SquareRoomService) { }

  ngOnInit(): void {
    this.svgEl = this.svgElRef.nativeElement;
  }

  onMouseDown(event: MouseEvent, point: paper.Point) {
    event.preventDefault();
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
          point.x = event.pageX-this.svgElArr[0];
          point.y = event.pageY-this.svgElArr[1];
        } else {
          const touch = event.touches[0];
          point.x = touch.pageX-this.svgElArr[0];
          point.y = touch.pageY-this.svgElArr[1];
        }
        this.squareRoomService.reDrawSubject.next("");
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
