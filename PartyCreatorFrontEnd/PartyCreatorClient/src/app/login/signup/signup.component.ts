import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CustomValidators } from '../custom-validators';
import { LoginComponent } from '../login.component';
import { RegisterDto } from 'src/app/interfaces/register-dto';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public signupForm: FormGroup; // formularz rejestracji
  credentials: RegisterDto= {firstName:'',lastName:'',email:'',password:''}

  constructor(private fb: FormBuilder, private loginComponent: LoginComponent, private auth: AuthService) {
    this.signupForm = this.createSingupForm();
  }

  // tworzenie formularza rejestracji
  createSingupForm(): FormGroup {
    return this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required, // imię jest wymagane
            Validators.minLength(3), // imię musi mieć co najmniej 3 znaki
            Validators.pattern('[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*'), // imię może zawierać tylko litery (w tym polskie litery)
          ],
        ],
        lastName: [
          '',
          [
            Validators.required, // nazwisko jest wymagane
            Validators.minLength(3), // nazwisko musi mieć co najmniej 3 znaki
            Validators.pattern('[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*'), // nazwisko może zawierać tylko litery (w tym polskie litery)
          ],
        ],
        email: ['', [Validators.required, Validators.email]], // email jest wymagany i musi być poprawnym adresem email
        password: [
          '',
          [
            Validators.required, // hasło jest wymagane
            CustomValidators.patternValidator(/\d/, { hasNumber: true }), // hasło musi zawierać co najmniej jedną cyfrę
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }), // hasło musi zawierać co najmniej jedną dużą literę
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }), // hasło musi zawierać co najmniej jedną małą literę
            Validators.minLength(8), // hasło musi mieć co najmniej 8 znaków
          ],
        ],
        confirmPassword: ['', [Validators.required]], // potwierdzenie hasła jest wymagane
      },
      {
        validator: CustomValidators.passwordMatchValidator, // niestandardowy walidator sprawdzający, czy hasło i potwierdzenie hasła są takie same
      }
    );
  }

  toggleForm() {
    this.loginComponent.toggleForm('signin'); // przełączenie formularza na logowanie
  }

  submit() {
    this.credentials.firstName=this.signupForm.value.firstName;
    this.credentials.lastName=this.signupForm.value.lastName;
    this.credentials.email=this.signupForm.value.email;
    this.credentials.password=this.signupForm.value.password;

    this.auth.signUp(this.credentials)
    .subscribe({
      next: (res) => {
        console.log(res.id); //test
        console.log(res.firstName); //test
        console.log(res.lastName); //test
        console.log(res.email); //test
        this.signupForm.reset(); //resetowanie formularza po jego złożeniu
        this.toggleForm(); //zmiana formularza z rejestracji na logowanie
      },
      error: (err: HttpErrorResponse) => {
        console.log(err?.error.message);
      }
    })
  }
}
