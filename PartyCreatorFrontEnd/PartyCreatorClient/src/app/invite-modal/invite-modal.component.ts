import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AllGuestsListDto } from '../interfaces/all-guests-list-dto';
import { EventService } from '../services/event.service';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { UserContactDto } from '../interfaces/user-contact-dto';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchEmailDto } from '../interfaces/search-email-dto';
import { InviteListDto } from '../interfaces/invite-list-dto';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    CommonModule
  ]
})
export class InviteModalComponent implements OnInit{
  users: UserContactDto[] = [];
  invitedUsers: UserContactDto[] =[];
  userSearch = this.fb.group({
    search: ''
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: {eventId: string, guests: AllGuestsListDto[], invites: AllGuestsListDto[]}, private eventService: EventService, private toast: NgToastService, private fb: FormBuilder, private userService: UserService) 
  {
    console.log(data);
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    var searchObject: SearchEmailDto = {email: this.userSearch.value.search!};
    
    this.userService.getUsersEmailContains(searchObject).subscribe({
      next: (res) => {
        this.users=res;
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000
        });
      },
    });
  }

  inviteToEvent(userContact: UserContactDto) {
    var invite: InviteListDto = {userId: userContact.userId, eventId: Number(this.data.eventId), id: 0} 
    this.eventService.inviteToEvent(invite).subscribe({
      next: (res) => {
        this.invitedUsers.push(userContact);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Użytkownik został zaproszony do wydarzenia',
          duration: 3000
        });
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }
}
