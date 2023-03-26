import { Component, OnInit } from '@angular/core';
import { SquareRoomService } from '../square-room.service';

@Component({
  selector: '[app-square-room-rulers]',
  templateUrl: './square-room-rulers.component.html',
  styleUrls: ['./square-room-rulers.component.css']
})
export class SquareRoomRulersComponent implements OnInit {

  constructor(public squareRoomService: SquareRoomService) { }

  ngOnInit(): void {
    this.squareRoomService.drawRulers();
  }

  startDrag(event: MouseEvent, target: any, wall: string) {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const origX = target.getAttributeNS(null, "x");
    const origY = target.getAttributeNS(null, "y");

    const drag = (event: MouseEvent) => {
      const x = origX + event.clientX - startX;
      const y = origY + event.clientY - startY;
      target.setAttributeNS(null, "x", x);
      target.setAttributeNS(null, "y", y);

      switch (wall) {
        case 'AB':
          this.squareRoomService.AB.length = +target.getAttributeNS(null, "width");
          break;
        case 'BC':
          this.squareRoomService.BC.length = +target.getAttributeNS(null, "height");
          break;
        case 'CD':
          this.squareRoomService.CD.length = +target.getAttributeNS(null, "width");
          break;
        case 'DA':
          this.squareRoomService.DA.length = +target.getAttributeNS(null, "height");
          break;
      }
    };

    const endDrag = (event: MouseEvent) => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", endDrag);
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);
  }
}
