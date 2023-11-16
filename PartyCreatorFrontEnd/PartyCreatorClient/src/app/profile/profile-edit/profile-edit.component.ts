import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { ProfileEditAvatarComponent } from './profile-edit-avatar/profile-edit-avatar.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [DatePipe],
})
export class ProfileEditComponent implements OnInit {
  public userData: any;
  public profileForm!: FormGroup;
  public profilePicture: string = '';

  constructor(
    private userService: UserService,
    private toast: NgToastService,
    private dialog: MatDialog
  ) {
    this.profileForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      birthday: new FormControl(''),
      description: new FormControl(''),
    });
  }
  maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  ngOnInit(): void {
    this.userService.getMyProfileData().subscribe((data) => {
      if (data) {
        this.userData = data;
        this.profilePicture = `assets/profile-avatars/${this.userData.image}`;
        this.profileForm = new FormGroup({
          firstName: new FormControl(
            this.userData ? this.userData.firstName : ''
          ),
          lastName: new FormControl(
            this.userData ? this.userData.lastName : ''
          ),
          email: new FormControl(this.userData ? this.userData.email : ''),
          birthday: new FormControl(
            this.userData ? this.userData.birthday : ''
          ),
          description: new FormControl(
            this.userData ? this.userData.description : ''
          ),
        });
      }
    });
  }

  changeProfilePicture(): void {
    const dialogRef = this.dialog.open(ProfileEditAvatarComponent);

    dialogRef.afterClosed().subscribe((selectedAvatar) => {
      if (selectedAvatar) {
        console.log(selectedAvatar);
        this.profilePicture = `assets/profile-avatars/${selectedAvatar}`;
        this.profileForm.value.image = selectedAvatar;
      }
    });
  }

  public editProfile(): void {
    this.userService.editMyProfileData(this.profileForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.userService.profileUpdated.next();
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Udało się edytować profil!',
          duration: 3000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }
}
