import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../interfaces/event-dto';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NavMenuMainComponent } from '../nav-menu-main/nav-menu-main.component';
import { MainCalendarComponent } from '../main/main-calendar/main-calendar.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    NavMenuMainComponent,
    MatTabsModule,
    MatIconModule,
    DatePipe,
    CommonModule,
    MainCalendarComponent,
  ],
})
export class MainComponent implements OnInit {
  selected: Date | null;
  myEvents: EventDto[] = [];

  constructor(
    private event: EventService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.selected = null;
  }

  ngOnInit(): void {
    this.getMyEvents();
    this.sortMyEvents();
  }

  openDialog() {
    const dialogRef = this.dialog.open(EventModalComponent, {
      panelClass: 'testDialog',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!!res) {
        this.getMyEvents();
      }
    });
  }

  getMyEvents() {
    this.event.getOfCreator().subscribe((res) => {
      this.myEvents = res;
      console.log(this.myEvents);
    });
  }

  sortMyEvents() {
    //sortowanie
  }
}
