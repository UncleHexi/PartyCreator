import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

//icons
import { faBell, faX } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { NotificationDto } from '../interfaces/notification-dto';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-nav-menu-main',
  templateUrl: './nav-menu-main.component.html',
  styleUrls: ['./nav-menu-main.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, MatMenuModule, MatIconModule],
})
export class NavMenuMainComponent implements OnInit {
  faBell = faBell;
  faX = faX;
  isExpanded = false;
  isNotificationVisible: boolean = false;
  notifications: NotificationDto[] = [];

  constructor(
    private auth: AuthService,
    private notificationService: NotificationService,
    private eventService: EventService,
    private toast: NgToastService
  ) {}

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    this.auth.signOut();
  }

  toggleNotifications() {
    this.isNotificationVisible = !this.isNotificationVisible;
  }

  doSomething($event: any) {
    $event.stopPropagation();
    //Another instructions
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getAllOfUser().subscribe({
      next: (res) => {
        console.log(res);

        this.notifications = res;
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

  acceptInvite(invite: NotificationDto) {
    this.eventService.acceptInvite(invite).subscribe({
      next: (res) => {
        this.notifications.splice(this.notifications.indexOf(invite), 1);
        console.log(res);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Udało się dołączyć do wydarzenia',
          duration: 3000,
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

  declineInvite(invite: NotificationDto) {
    this.eventService.declineInvite(invite).subscribe({
      next: (res) => {
        this.notifications.splice(this.notifications.indexOf(invite), 1);
        console.log(res);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Odrzuciłeś zaproszenie do wydarzenia',
          duration: 3000,
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
