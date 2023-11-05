import { NgClass } from '@angular/common';
import { Component} from '@angular/core';

//icons
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-menu-main',
  templateUrl: './nav-menu-main.component.html',
  styleUrls: ['./nav-menu-main.component.css']
})

export class  NavMenuMainComponent{

  faBell = faBell;

  isExpanded = false;

  isNotificationVisible: boolean = false;

  constructor(private auth: AuthService) {}

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    this.auth.signOut();
  }

  toggleNotifications() {
    this.isNotificationVisible = !this.isNotificationVisible;
  }
}