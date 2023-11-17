import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../interfaces/event-dto';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
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

  upcomingEvents: EventDto[] = [];
  constructor(
    private event: EventService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.selected = null;
  }

  ngOnInit(): void {
    forkJoin({
      myEvents: this.event.getOfCreator(),
      upcomingEvents: this.event.getUpcomingEvents(),
    }).subscribe((data) => {
      this.myEvents = data.myEvents;
      this.filterPastEvents();
      this.sortMyEvents();

      this.upcomingEvents = data.upcomingEvents;
      this.filterPastEventsInUpcoming();
      this.sortUpcomingEvents();
    });
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
      this.filterPastEvents();
      console.log(this.myEvents);
    });
  }

  filterPastEvents() {
    const currentDate = new Date();
    this.myEvents = this.myEvents.filter((event) => {
      return new Date(event.dateTime).getTime() >= currentDate.getTime(); //sprawdzenie, czy wydarzenie się już odbyło
    });
  }

  getUpcomingEvents() {
    this.event.getUpcomingEvents().subscribe((res) => {
      console.log('Received upcoming events from service:', res);
      this.upcomingEvents = res;
      this.filterPastEventsInUpcoming();
      this.sortUpcomingEvents();
      console.log('Upcoming events after sorting:', this.upcomingEvents);
    });
  }

  filterPastEventsInUpcoming() {
    const currentDate = new Date();
    this.upcomingEvents = this.upcomingEvents.filter((event) => {
      // Sprawdzamy, czy wydarzenie odbyło się już
      return new Date(event.dateTime).getTime() >= currentDate.getTime();
    });
  }
  sortUpcomingEvents() {
    console.log('Before sorting:', this.upcomingEvents);
    // Sortuj wydarzenia od najbliższej daty do najdalszej
    this.upcomingEvents.sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return dateA - dateB;
    });
    console.log('After sorting:', this.upcomingEvents);
  }
  sortMyEvents() {
    console.log('Before sorting:', this.myEvents);
    // Sortuj wydarzenia od najbliższej daty do najdalszej
    this.myEvents.sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return dateA - dateB;
    });
    console.log('After sorting my events:', this.myEvents);
  }
}
