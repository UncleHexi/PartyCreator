import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})

// formularz logowania
export class SigninComponent {
  email = new FormControl('');
  password = new FormControl('');

  updateEmail() {
    this.email.setValue('test');
  }
}
