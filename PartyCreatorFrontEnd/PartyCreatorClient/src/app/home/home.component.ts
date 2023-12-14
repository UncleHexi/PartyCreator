import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
//icons
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import {
  faAnglesDown,
  faCalendarPlus,
  faPhotoFilm,
  faMoneyBillTransfer,
  faUserPlus,
  faSquarePollVertical,
  faPersonCircleQuestion,
  faListCheck,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { SignalRService } from '../services/signal-r.service';
//icons
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'PartyCreatorClient';
  //icons
  faSpotify = faSpotify; //ikonka spotify
  faMoney = faMoneyBillTransfer;
  faCalendar = faCalendarPlus;
  faPhoto = faPhotoFilm;
  faUser = faUserPlus;
  faPoll = faSquarePollVertical;
  faPerson = faPersonCircleQuestion;
  faList = faListCheck;
  faComments = faComments;
  faArrowDown = faAnglesDown;
  //end of icons
  user = '';
  message = '';
  messages: { user: string; text: string }[] = [];
  isLoggedIn = false;

  constructor(
    private auth: AuthService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.signalRService.hubConnection.on(
      'EventJoined',
      (user: string, text: string) => {
        this.messages.push({ user, text });
      }
    );
    this.addToEventGroup();
    window.addEventListener('signalRConnected', (e) => this.addToEventGroup());

    this.auth.changeIsLoggedInValue();
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  sendMessage() {
    // this.signalRService.hubConnection
    //   .invoke('SendPrivateMessage', '18', this.user, this.message)
    //   .catch((err) => console.error(err));
    // this.message = '';
  }

  addToEventGroup() {
    //sprawdz jeszcze czy juz nie jest dolaczony
    if (
      this.signalRService.hubConnection.state ===
      signalR.HubConnectionState.Connected
    ) {
      this.signalRService.hubConnection
        .invoke('AddToEventGroup', '100')
        .catch((err) => console.error(err));
    }
  }

  scrollToElement($element: HTMLElement): void {
    console.log($element);
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  changeLoginType() {
    this.auth.changeLoginType('signup');
  }
}
