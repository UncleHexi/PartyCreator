import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'PartyCreatorClient';
  //SignalR
  //Mariusz
  //Michal
  private hubConnection!: signalR.HubConnection;
  user = '';
  message = '';
  messages: { user: string; text: string }[] = [];

  constructor() {}

  ngOnInit(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7241/chat')
      .build();

    this.hubConnection.start().catch((err) => console.error(err));

    this.hubConnection.on('ReceiveMessage', (user: string, text: string) => {
      this.messages.push({ user, text });
    });
  }

  sendMessage() {
    this.hubConnection
      .invoke('SendMessage', this.user, this.message)
      .catch((err) => console.error(err));
    this.message = '';
  }
}

