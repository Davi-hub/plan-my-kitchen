import { Component, Input } from '@angular/core';
import { Wall } from 'src/app/classes/wall';
import { RoomService } from '../room.service';

@Component({
  selector: '[app-walls]',
  templateUrl: './walls.component.html',
  styleUrls: ['./walls.component.css']
})

export class WallsComponent {
  @Input() walls!: Wall[];

  constructor(private roomService: RoomService) { }

  onAddWall(index: number) {
    const vektor = this.walls[index].innerLine.v.clone().normalize().multiply(100);
    const newPoint = this.walls[index].innerLine.P2.add(vektor);

    this.roomService.pointArray.splice(index + 1, 0, newPoint)
    this.roomService.reDrawSubject.next("");
  }

  onDeleteWall(index: number) {
    this.roomService.pointArray.splice(index, 1);
    this.roomService.reDrawSubject.next("");
  }
}
