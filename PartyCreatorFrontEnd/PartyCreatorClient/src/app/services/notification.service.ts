import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationDto } from '../interfaces/notification-dto';
import { NotificationResponseDto } from '../interfaces/notification-response-dto';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl: string = 'https://localhost:7241/api/Notification/';

  constructor(private http: HttpClient) {}

  getAllOfUser() {
    return this.http.get<NotificationDto[]>(
      'https://localhost:7241/api/Notification/getAllOfUser'
    );
  }

  toggleRead(id: number) {
    return this.http.put<NotificationDto>(
      `https://localhost:7241/api/Notification/toggleRead`,
      id
    );
  }

  delete(id: string) {
    return this.http.delete<NotificationResponseDto>(
      `https://localhost:7241/api/Notification/deleteNotification/${id}`
    );
  }
}
