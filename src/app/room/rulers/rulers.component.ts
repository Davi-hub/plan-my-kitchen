import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Wall } from 'src/app/classes/wall';
import { RoomService } from '../room.service';

@Component({
  selector: '[app-rulers]',
  templateUrl: './rulers.component.html',
  styleUrls: ['./rulers.component.css']
})
export class RulersComponent implements AfterViewInit {
  @Input() walls!: Wall[];
  @Input() scale!: number;
  @Input() isEditMode!: boolean;
  inputAngle!: number;

  constructor(public roomService: RoomService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onClickInput(wall: Wall, forObj: HTMLElement, event: Event) {
    event.stopPropagation();
    wall.isInputMode = true;
    console.log(forObj);
    forObj.setAttribute(
      "transform",
      "rotate(0deg, wall.ruler.inputPositionPoint.x, wall.ruler.inputPositionPoint.y)"
    );
  }

  onBlurInput(event: FocusEvent) {
    event.stopPropagation();
    this.onClose()
  }

  onClose() {
    this.roomService.reDrawSubject.next("");
  }

  onDone(i: number, input: HTMLInputElement) {
    let x = i - 1;
    if (x < 0) x = this.walls.length - 1;
    let choosenPoint = this.roomService.pointArray[x];
    this.roomService.pointArray[i] = choosenPoint.clone()
      .add(this.walls[i].innerLine.v.normalize().multiply(+input.value));
    this.roomService.reDrawSubject.next("");
  }

}
