import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

// formularz rejestracji
export class SignupComponent {
  public signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

  submit() {
    this.signupForm.reset(); // resetowanie formularza po jego złożeniu
  }
}
