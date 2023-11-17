import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventDto } from '../interfaces/event-dto';
import { faLocationDot, faCheck, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css'],
  
  animations: [
    trigger('slideDown', [
      state('void', style({ height: '0', opacity: '0' })),
      state('*', style({ height: '*', opacity: '1' })),
      transition('void <=> *', animate('500ms ease-in-out')),
    ]),
    trigger('pulse', [
      state('rest', style({ transform: 'scale(1)' })),
      state('pulse', style({ transform: 'scale(1.2)' })),
      transition('rest <=> pulse', animate('500ms ease-in-out')),
    ]),
  ]
  
})
export class EventViewComponent implements OnInit {
  faArrowRight: any;
  selected: Date | null;
  eventDetails: EventDto | null;
  
  faClock = faClock;
  faCalendar = faCalendar;
  faLocationDot = faLocationDot;
  faCheck = faCheck;
  isThingsToBringVisible: boolean = false; 
  isMapVisible: boolean = false;

  arrowAnimationState: string = 'rest';




  constructor(private route: ActivatedRoute, private eventService: EventService) {
    this.selected = null;
    this.eventDetails = null;
  }

  ngOnInit(): void {
    this.loadEventDetails();
  }

  loadEventDetails(): void {
    const eventId: string | null = this.route.snapshot.paramMap.get('id');
    if (eventId !== null) {
      this.eventService.getEventDetails(eventId).subscribe(
        (data: EventDto | null) => {
          if (data !== null) {
            this.eventDetails = data;
          } else {
            console.error('Otrzymano nullowe dane z serwera');
          }
        },
        (error: any) => {
          console.error('Wystąpił błąd podczas pobierania szczegółów wydarzenia', error);
        }
      );
    } else {
      console.error('ID wydarzenia jest nullem lub niezdefiniowane');
    }
  }

  // Added function to toggle visibility
  toggleThingsToBringVisibility(): void {
    this.isThingsToBringVisible = !this.isThingsToBringVisible;
    this.arrowAnimationState = this.isThingsToBringVisible ? 'pulse' : 'rest';
  }

  toggleMapVisibility(): void{
    this.isMapVisible = !this.isMapVisible;
  }
}
