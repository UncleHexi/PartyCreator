import { Component, Inject } from '@angular/core';
import { ContactDto } from '../interfaces/contact-dto';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllGuestsListDto } from '../interfaces/all-guests-list-dto';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css']
})
export class InviteModalComponent {
  users: ContactDto[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: AllGuestsListDto[]) {
    console.log(data);
  }

}
