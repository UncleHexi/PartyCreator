import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

// formularz rejestracji
export class SignupComponent {
  firstName = new FormControl('');
  lastName = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');
}
