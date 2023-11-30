import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { NavMenuMainComponent } from 'src/app/nav-menu-main/nav-menu-main.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, NavMenuMainComponent, MatTabsModule, MatIconModule],
})
export class UserProfileComponent implements OnInit {
  public userData: any;
  public profilePicture: string = '';
  public userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserData(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data;
        this.profilePicture = `assets/profile-avatars/${this.userData.image}`;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
