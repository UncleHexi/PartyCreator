import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './services/auth.service';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PartyCreatorClient';

  constructor(
    private auth: AuthService,
    private signalRservice: SignalRService
  ) {}

  ngOnInit(): void {
    this.signalRservice.startConnection();

    window.addEventListener('authTokenChanged', (e) =>
      this.onAuthTokenChanged(e)
    );

    window.addEventListener('storage', (e) => this.onManualStorageChange(e));
  }

  private onAuthTokenChanged(event: Event) {
    var token = this.auth.getToken();

    if (
      this.signalRservice.hubConnection.state ===
        signalR.HubConnectionState.Disconnected &&
      token != null
    ) {
      this.signalRservice.startConnection();
    }
    if (
      this.signalRservice.hubConnection.state ===
      signalR.HubConnectionState.Connected
    ) {
      this.signalRservice.hubConnection.stop();
    }
  }

  private onManualStorageChange(event: Event) {
    if (this.auth.getToken() == null) {
      this.signalRservice.hubConnection.stop();
    } else {
      this.signalRservice.startConnection();
    }
  }
}
