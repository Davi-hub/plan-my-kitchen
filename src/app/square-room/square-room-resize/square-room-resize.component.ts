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
  private startX = 0;
  private startY = 0;

  constructor(private renderer: Renderer2, public squareRoomService: SquareRoomService) { }

  ngOnInit(): void {
  }

  startDragging(clientX: number, clientY: number) {
    this.svgEl = this.svgElRef.nativeElement;
    this.isDragging = true;
    this.startX = clientX - this.svgEl.parentElement!.parentElement!.getBoundingClientRect().x;
    this.startY = clientY - this.svgEl.parentElement!.parentElement!.getBoundingClientRect().y;
    console.log('mouseDown');
  }

  stopDragging() {
    this.isDragging = false;
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }

  activateMoveListener(moveType: string, point: paper.Point) {
    this.mouseMoveListener = this.renderer.listen(window, moveType, (event) => {
      if (this.isDragging) {
        console.log('touchstart');
        this.svgElArr = [
          this.svgEl.parentElement!.parentElement!.getBoundingClientRect().x,
          this.svgEl.parentElement!.parentElement!.getBoundingClientRect().y
        ];
        point.x = event.pageX-this.svgElArr[0];
        point.y = event.pageY-this.svgElArr[1];
        this.squareRoomService.reDrawSubject.next("");
      }
    });
  }

  onMouseDown(event: MouseEvent, point: paper.Point) {
    event.preventDefault();
    this.startDragging(event.clientX, event.clientY);
    this.activateMoveListener('mousemove', point);

  }

  onTouchStart(event: TouchEvent, point: paper.Point) {
      event.preventDefault();
      const touch = event.touches[0];
      this.startDragging(touch.clientX, touch.clientY);
      this.activateMoveListener('touchmove', point);
  }


  onMouseUp() {
    this.stopDragging();
  }

  onTouchEnd() {
    this.stopDragging();
  }

  // @HostListener('document:pointerup', ['$event'])
  // public upHandle(event: PointerEvent) {
  //   this.isDraggingPoint = false;
  //   this.draggingPoint = null;
  // }

  // @HostListener('document:pointermove', ['$event'])
  // public moveHandle(pointerEvent: PointerEvent) {
  //   pointerEvent.preventDefault();
  //   pointerEvent.stopPropagation();

  //   if (this.isDraggingPoint) {
  //     this.svgEl = this.svgElRef.nativeElement;
  //     this.svgElArr = [
  //       this.svgEl.parentElement!.parentElement!.getBoundingClientRect().x,
  //       this.svgEl.parentElement!.parentElement!.getBoundingClientRect().y
  //     ];
  //     this.draggingPoint!.x = pointerEvent.pageX-this.svgElArr[0];
  //     this.draggingPoint!.y = pointerEvent.pageY-this.svgElArr[1];
  //     this.squareRoomService.reDrawSubject.next("");
  //   }
  // }

  // downHandlePoints(pointerEvent: PointerEvent, point: paper.Point) {
  //   this.isDraggingPoint = true;
  //   this.draggingPoint = point;
  //   pointerEvent.preventDefault();
  // }

}
