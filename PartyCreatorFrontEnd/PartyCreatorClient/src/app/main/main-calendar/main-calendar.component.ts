import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import {
  CalendarEvent,
  CalendarModule,
  CalendarView,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-calendar',
  templateUrl: './main-calendar.component.html',
  styleUrls: ['./main-calendar.component.css'],
  standalone: true,
  imports: [CalendarModule, CommonModule],
})
export class MainCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  calendarEvents: CalendarEvent[] = [];
  refresh = new Subject<void>();

  constructor(private event: EventService) {}

  myEvents: any[] = [];

  ngOnInit(): void {
    this.getMyEvents();
  }

  getMyEvents() {
    this.event.getOfCreator().subscribe((res) => {
      this.myEvents = res;
      this.calendarEvents = this.myEvents.map((event) => {
        return {
          start: new Date(event.dateTime),
          title: event.title,
        };
      });
    });
  }
  activeDayIsOpen: boolean = true;

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

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
