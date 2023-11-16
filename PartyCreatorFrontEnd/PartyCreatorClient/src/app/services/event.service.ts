import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventDto } from '../interfaces/event-dto';
import { EventCreateDto } from '../interfaces/event-create-dto';
import { Observable } from 'rxjs';
import { InviteListDto } from '../interfaces/invite-list-dto';
import { NotificationDto } from '../interfaces/notification-dto';
import { GuestListDto } from '../interfaces/guest-list-dto';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl: string = "https://localhost:7241/api/Auth/"
  private baseUrl2: string = "https://localhost:7241/api/Event/"
  constructor(private http: HttpClient) { }

  getMe() {
    return this.http.get<string>(`${this.baseUrl}getme`);
  }

  getEventDetails(id: string): Observable<any> {
    return this.http.get(`https://localhost:7241/api/Event/${id}`);
  }

  getOfCreator() {
    return this.http.get<EventDto[]>(`${this.baseUrl2}getOfCreator`);
  }

  createEvent(eventObj: EventCreateDto) {
    return this.http.post<EventDto>(`${this.baseUrl2}create`,eventObj);
  }

  inviteToEvent(inviteList: InviteListDto) {
    return this.http.post<InviteListDto>(`${this.baseUrl2}invite`, inviteList);
  }

  acceptInvite(notification: NotificationDto) {
    return this.http.post<GuestListDto>(`${this.baseUrl2}accept`, notification);
  }

  declineInvite(notification: NotificationDto) {
    return this.http.post<InviteListDto>(`${this.baseUrl2}decline`, notification);
  }
}
