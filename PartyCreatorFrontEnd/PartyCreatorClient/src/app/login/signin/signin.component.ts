import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../login.component';
import { LoginDto } from 'src/app/interfaces/login-dto';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  public signinForm: FormGroup; // formularz logowania
  credentials: LoginDto = {email:'', password:''};

  constructor(private fb: FormBuilder, private loginComponent: LoginComponent, private auth: AuthService, private router: Router) {
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
    this.credentials.email=this.signinForm.value.email;
    this.credentials.password=this.signinForm.value.password;
    
    this.auth.signIn(this.credentials)
    .subscribe({
      next: (res) => {
        console.log("test czy dziala"); //test
        console.log(res.token);
        this.signinForm.reset(); // resetowanie formularza po jego złożeniu
        this.router.navigate(['main']);
      },
      error: (err: HttpErrorResponse) => {
        console.error("HTTP Status Code", err.status); //test
      }
    })
    
  }

  eyeIcon = 'fa-eye-slash'; // ikona ukrywania hasła

  hideShowPass() {
    // pokazywanie/ukrywanie hasła

    var x = document.getElementById('password');
    if (x!.getAttribute('type') == 'password') {
      x!.setAttribute('type', 'text');
      this.eyeIcon = 'fa-eye';
    } else {
      x!.setAttribute('type', 'password');
      this.eyeIcon = 'fa-eye-slash';
    }
  }
}
