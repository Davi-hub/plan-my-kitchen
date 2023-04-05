import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Wall } from 'src/app/classes/wall';
import { SquareRoomService } from '../square-room.service';

@Component({
  selector: '[app-square-room-rulers]',
  templateUrl: './square-room-rulers.component.html',
  styleUrls: ['./square-room-rulers.component.css']
})
export class SquareRoomRulersComponent implements AfterViewInit{
  @Input() walls!: Wall[];

  constructor(public squareRoomService: SquareRoomService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
      this.cdr.detectChanges();
  }

}
