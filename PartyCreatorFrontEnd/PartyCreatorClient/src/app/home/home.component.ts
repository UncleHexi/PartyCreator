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
  private hubConnection!: signalR.HubConnection;
  user = '';
  message = '';
  messages: { user: string; text: string }[] = [];
  isLoggedIn = false;
  private baseUrl = environment.apiUrl.replace('/api/', '');

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.baseUrl}/chat`, {
          accessTokenFactory: () => this.auth.getToken()!,
        })
        .build();

      this.hubConnection.start().catch((err) => console.error(err));

      this.hubConnection.on('ReceiveMessage', (user: string, text: string) => {
        this.messages.push({ user, text });
      });
    }

    this.isLoggedIn = this.auth.isLoggedIn();
  }

  sendMessage() {
    this.hubConnection
      .invoke('SendMessage', this.user, this.message)
      .catch((err) => console.error(err));
    this.message = '';
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
