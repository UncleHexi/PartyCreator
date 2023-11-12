import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  public userData: any;
  public profileForm!: FormGroup;

  constructor(private userService: UserService) {
    this.profileForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      birthday: new FormControl(''),
      description: new FormControl(''),
    });
  }
  
  
  ngOnInit(): void {
    this.userService.getMyProfileData().subscribe((data) => {
      if (data) {
        this.userData = data;
        this.profileForm = new FormGroup({
          firstName: new FormControl(this.userData ? this.userData.firstName : ''),
          lastName: new FormControl(this.userData ? this.userData.lastName : ''),
          email: new FormControl(this.userData ? this.userData.email : ''),
          birthday: new FormControl(this.userData ? this.userData.birthday : ''),
          description: new FormControl(this.userData ? this.userData.description : ''),
        });
      }
    });
  }
  
  public editProfile(): void {
    this.userService.editMyProfileData(this.profileForm.value).subscribe();
  }

}
