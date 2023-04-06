import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Wall } from 'src/app/classes/wall';
import { RoomService } from '../room.service';

@Component({
  selector: '[app-rulers]',
  templateUrl: './rulers.component.html',
  styleUrls: ['./rulers.component.css']
})
export class RulersComponent implements AfterViewInit{
  @Input() walls!: Wall[];

  constructor(public roomService: RoomService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
      this.cdr.detectChanges();
  }

  onClickInput(wall: Wall) {
    wall.isInputMode = true;
  }

  onBlurInput(wall: Wall) {
    wall.isInputMode = false;
  }

  onClose(wall: Wall) {
    wall.isInputMode = false;
  }

  onDone(i: number, input: HTMLInputElement) {
    let choosenPoint = this.roomService.pointArray[i-1];
    this.roomService.pointArray[i] = choosenPoint.clone()
      .add(this.walls[i].innerLine.v.normalize().multiply(+input.value));
    this.roomService.reDrawSubject.next("");
  }

}
