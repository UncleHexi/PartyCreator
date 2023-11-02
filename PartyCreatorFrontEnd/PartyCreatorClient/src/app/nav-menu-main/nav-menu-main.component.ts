import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

//icons
import { faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-menu-main',
  templateUrl: './nav-menu-main.component.html',
  styleUrls: ['./nav-menu-main.component.css']
})

export class  NavMenuMainComponent{
  faBell = faBell;
  isExpanded = false;
  isNotificationVisible: boolean = false;
  @Output() hideNotificationsEvent = new EventEmitter<void>();

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  showNotifications() {
    this.isNotificationVisible = true;
  }

  hideNotifications() {
    this.isNotificationVisible = false;
  }
}