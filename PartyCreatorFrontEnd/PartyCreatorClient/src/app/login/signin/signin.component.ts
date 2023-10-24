import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../login.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  ngOnInit(): void {}

  public signinForm: FormGroup; // formularz logowania

  constructor(private fb: FormBuilder, private loginComponent: LoginComponent) {
    this.signinForm = this.createSigninForm();
  }

  // tworzenie formularza logowania
  createSigninForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required]], // email jest wymagany
      password: ['', [Validators.required]], // hasło jest wymagane
    });
  }

  toggleForm() {
    this.loginComponent.toggleForm('signup'); // przełączenie formularza na rejestrację
  }

  submit() {
    this.loginComponent.toggleForm('signup'); // przełączenie formularza na rejestrację
  }
}
