import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginDto } from '../interfaces/login-dto';
import { RegisterDto } from '../interfaces/register-dto';
import { LoginResponseDto } from '../interfaces/login-response-dto';
import { UserDto } from '../interfaces/user-dto';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl + 'Auth/';
  private loginTypeSource = new BehaviorSubject<string>('signin'); //domyślnie signin
  currentLoginType = this.loginTypeSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  signUp(registerObj: RegisterDto) {
    return this.http.post<UserDto>(`${this.baseUrl}register`, registerObj);
  }

  signIn(loginObj: LoginDto) {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}login`, loginObj);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.clear();
    this.changeLoginType('signin');
    this.router.navigate(['logowanie']);
  }

  changeLoginType(type: string) {
    this.loginTypeSource.next(type);
  }
}
