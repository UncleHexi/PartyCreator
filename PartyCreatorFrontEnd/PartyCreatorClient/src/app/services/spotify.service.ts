import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginResponseDto } from '../interfaces/login-response-dto';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private baseUrl = environment.apiUrl + 'Spotify/';

  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getAccessToken(code: string) {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}getAccessToken`, {
      code,
    });
  }

  storeToken(token: string) {
    localStorage.setItem('spotifyToken', token);
  }

  getToken() {
    return localStorage.getItem('spotifyToken');
  }

  async searchTracks(query: string) {
    const result = await fetch(
      'https://api.spotify.com/v1/search?q=' + query + '&type=track&limit=5',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.getToken(),
        },
      }
    );
    return await result.json();
  }
}
