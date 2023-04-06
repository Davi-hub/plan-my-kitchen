import { Injectable } from '@angular/core';
import { Point } from 'paper/dist/paper-core';
import { Subject } from 'rxjs';
import { HelpersService } from '../shared/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  pointArray = [new Point(100,100),new Point(600,100),new Point(600,600),new Point(350,850),new Point(100,600)]
  reDrawSubject = new Subject();


  constructor(private helpersService: HelpersService) { }

}
