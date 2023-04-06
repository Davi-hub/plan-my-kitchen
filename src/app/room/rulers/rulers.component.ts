import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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

}
