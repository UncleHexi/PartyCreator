import { Component } from '@angular/core';
import { EventCreateDto } from '../interfaces/event-create-dto';
import { EventService } from '../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {
  eventData: EventCreateDto = {
    title:'',
    description: '',
    dateTime: new Date(),
    city: '',
    zip: '',
    address: '',
    country: '',
    color: '',
    playlist: '',
    shoppingList: '',
    receipt: ''
  }
  constructor(private eventService: EventService, private toast: NgToastService) {
    
  }
  
  createEvent() {
    this.eventService.createEvent(this.eventData)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success({detail:"SUCCESS", summary:"Udało się stworzyć wydarzenie!",duration:5000});
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error({detail:"ERROR", summary:err.error, duration:5000});
      }
    })
  }

  onSubmit() {
    this.createEvent();
  }
}
