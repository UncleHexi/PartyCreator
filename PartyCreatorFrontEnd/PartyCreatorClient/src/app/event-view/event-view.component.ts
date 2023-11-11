import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventDto } from '../interfaces/event-dto';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  faArrowRight: any; // Dostosuj typ, jeśli to konieczne
  selected: Date | null;
  eventDetails: EventDto | null;

  faLocationDot = faLocationDot;
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
}