import { Component, Output, EventEmitter } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  faX = faX;
  
  isVisible: boolean = true;

  @Output() toggleNotifications = new EventEmitter<boolean>();

  hideNotifications() {
    this.isVisible = false;
    this.toggleNotifications.emit(false); // Przekazuje informację, że powiadomienia są ukryte
  }
}
