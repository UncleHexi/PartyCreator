import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent {
  constructor(private userService: UserService) {}

  public userData: any;

  ngOnInit(): void {
    this.userService.getMyProfileData().subscribe((data) => {
      this.userData = data;
    });
  }

}
