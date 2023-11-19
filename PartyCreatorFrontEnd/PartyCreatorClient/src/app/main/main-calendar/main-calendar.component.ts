import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import {
  CalendarEvent,
  CalendarModule,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

@Component({
  selector: 'app-main-calendar',
  templateUrl: './main-calendar.component.html',
  styleUrls: ['./main-calendar.component.css'],
  standalone: true,
  imports: [CalendarModule, CommonModule],
  providers: [{
    provide: CalendarEventTitleFormatter,
    useClass: CustomEventTitleFormatter,
  },],
})
export class MainCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  calendarEvents: CalendarEvent[] = [];
  refresh = new Subject<void>();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  CalendarView = CalendarView;

  constructor(private event: EventService) {}

  myEvents: any[] = [];

  ngOnInit(): void {
    this.getMyEvents();
  }

  getMyEvents() {
    forkJoin({
      creatorEvents: this.event.getOfCreator(),
      upcomingEvents: this.event.getUpcomingEvents(),
    }).subscribe(({ creatorEvents, upcomingEvents }) => {
      this.myEvents = [...creatorEvents, ...upcomingEvents];
      this.calendarEvents = this.myEvents.map((event) => {
        return {
          start: new Date(event.dateTime),
          title: event.title,
        };
      });
    });
  }
  activeDayIsOpen: boolean = false;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
