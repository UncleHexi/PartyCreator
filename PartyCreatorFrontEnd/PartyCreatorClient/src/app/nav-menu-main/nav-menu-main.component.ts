import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

//icons
import { faBell, faX } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-nav-menu-main',
  templateUrl: './nav-menu-main.component.html',
  styleUrls: ['./nav-menu-main.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, MatMenuModule],
})
export class NavMenuMainComponent implements OnInit {
  faBell = faBell;
  faX = faX;
  isExpanded = false;

  isNotificationVisible: boolean = false;

  constructor(
    private auth: AuthService,
    private notificationService: NotificationService,
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
}
