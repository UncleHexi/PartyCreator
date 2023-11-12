import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../interfaces/user-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserData(userId: string): Observable<any> {
    return this.http.get(
      'https://localhost:7241/api/User/GetUserById/${userId}'
    );
  }

  getMyProfileData(): Observable<any> {
    return this.http.get<UserDto>('https://localhost:7241/api/User/GetMyProfile');
  }

  editMyProfileData(userData: UserDto): Observable<any> {
    return this.http.post<UserDto>(
      'https://localhost:7241/api/User/EditMyProfile',
      userData
    );
  }
}
