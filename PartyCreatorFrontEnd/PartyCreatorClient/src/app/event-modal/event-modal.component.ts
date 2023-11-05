import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {
  eventForm = this.fb.group({
    title: '',
    desciption: '',
    city: '',
  });
  constructor(private fb: FormBuilder) {

  }
}
