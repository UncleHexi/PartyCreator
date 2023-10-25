import { Component } from '@angular/core';

export type LoginType = 'signin' | 'signup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

// wybór między logowaniem a rejestracją
export class LoginComponent {
  //ustawianie domyślnego formularza
  login: LoginType = 'signin';

  get showSignInForm() {
    return this.login === 'signin';
  }

  get showSignUpForm() {
    return this.login === 'signup';
  }

  toggleForm(type: LoginType) {
    this.login = type;
  }
}
