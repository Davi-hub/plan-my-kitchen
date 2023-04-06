import { Component, Input, OnInit } from '@angular/core';
import { Wall } from 'src/app/classes/wall';

@Component({
  selector: '[app-walls]',
  templateUrl: './walls.component.html',
  styleUrls: ['./walls.component.css']
})
export class WallsComponent {
  @Input() walls!: Wall[]
}
