import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatDialogModule, MatButtonModule],
})
export class AddContactDialogComponent {}
