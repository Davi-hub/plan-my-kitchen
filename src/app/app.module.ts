import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { WallsComponent } from './room/walls/walls.component';
import { RulersComponent } from './room/rulers/rulers.component';
import { ResizeComponent } from './room/resize/resize.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnglesComponent } from './room/angles/angles.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    WallsComponent,
    RulersComponent,
    ResizeComponent,
    AnglesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

