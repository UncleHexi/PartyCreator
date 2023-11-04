import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl: string = "https://localhost:7241/api/Auth/"
  constructor(private http: HttpClient) { }

  getMe() {
    return this.http.get<string>(`${this.baseUrl}getme`);
  }
}
