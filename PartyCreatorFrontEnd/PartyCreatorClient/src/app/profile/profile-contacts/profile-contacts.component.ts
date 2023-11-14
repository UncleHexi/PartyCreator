import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';

@Component({
  selector: 'app-profile-contacts',
  templateUrl: './profile-contacts.component.html',
  styleUrls: ['./profile-contacts.component.css'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatButtonModule],
})
export class ProfileContactsComponent {
  constructor(private userService: UserService, private dialog: MatDialog) {}

  public contacts: any;
  ngOnInit(): void {
    this.refreshContacts();
  }

  private refreshContacts(): void {
    this.userService.getMyContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.userService.addContact(result).subscribe({
          next: () => {
            this.refreshContacts();
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }
}
