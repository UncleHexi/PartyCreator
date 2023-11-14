import { Component } from '@angular/core';
import { EventCreateDto } from '../interfaces/event-create-dto';
import { EventService } from '../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatChipsModule
  ],
  providers: [DatePipe],
})
export class EventModalComponent {
  eventData: EventCreateDto = {
    title: '',
    description: '',
    dateTime: new Date(),
    city: '',
    zip: '',
    address: '',
    country: '',
    color: '',
    playlist: '',
    shoppingList: '',
    receipt: '',
  };
  eventOptions = this.fb.group({
    title: '',
    description: '',
    time: '',
    dateTime: new Date(),
    city: '',
    zip: '',
    address: '',
    country: '',
    color: '',
    playlist: false,
    shoppingLis: false,
    receipt: false,
  });
  minDate = new Date();

  constructor(
    private eventService: EventService,
    private toast: NgToastService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  createEvent() {
    this.eventService.createEvent(this.eventData).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Udało się stworzyć wydarzenie!',
          duration: 5000,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 5000,
        });
      },
    });
  }

  onSubmit() {
    this.addTimeToDate();
    this.convertFormToData()
    this.createEvent();
    console.log(this.eventData)
  }

  addTimeToDate() {
    const datePart = this.datePipe.transform(
      this.eventOptions.value.dateTime,
      'yyyy-MM-dd',
      'pl-PL'
    );
    const timePart = this.eventOptions.value.time;
    const combinedDateTimeString = `${datePart}T${timePart}`;
    console.log(combinedDateTimeString);
    const combinedDateTime = new Date(combinedDateTimeString);
    console.log(combinedDateTime);

    this.eventOptions.value.dateTime=combinedDateTime;
  }

  convertFormToData() {
    this.eventData.title=this.eventOptions.value.title!;
    this.eventData.description=this.eventOptions.value.description!;
    this.eventData.dateTime=this.eventOptions.value.dateTime!;
    this.eventData.city=this.eventOptions.value.city!;
    this.eventData.address=this.eventOptions.value.address!;
    this.eventData.country=this.eventOptions.value.country!;
    //dodanie 
    if(this.eventOptions.value.playlist) {
      this.eventData.playlist="Title";
    }
    else {
      this.eventData.playlist="";
    }

    if(this.eventOptions.value.shoppingLis) {
      this.eventData.shoppingList="Title";
    }
    else {
      this.eventData.shoppingList="";
    }

    if(this.eventOptions.value.receipt) {
      this.eventData.receipt="Title";
    }
    else {
      this.eventData.receipt="";
    }

    //do usuniecia?
    this.eventData.zip = "";
    this.eventData.color = "";
  }
}
