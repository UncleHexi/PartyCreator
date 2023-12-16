import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageReceiveDto } from 'src/app/interfaces/chat-message-receive-dto';
import { ChatService } from 'src/app/services/chat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { ChatMessageSendDto } from 'src/app/interfaces/chat-message-send-dto';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
})
export class ChatComponent implements OnInit {
  @Input() eventId = '';
  @Input() messages: ChatMessageReceiveDto[] = [];
  @ViewChild('myScrollContainer', { static: false }) myScrollContainer!: ElementRef;
  newMessage: string;
  userId: number;
  firstName: string;
  lastName: string;
  messageData= this.fb.group({
    message: '',
  });
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private toast: NgToastService,
    private fb: FormBuilder
  ) {
    this.newMessage = '';
    this.userId = 0;
    this.firstName = ' ';
    this.lastName = ' ';
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  loadUserData() {
    this.userService.getMyProfileData().subscribe(
      (userData) => {
        this.userId = userData.id;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  sendMessage() {
  if(this.messageData.value.message != '' || this.messageData.value.message != null){
      const messageToSend: ChatMessageSendDto = {
        id: 0,
        userId: this.userId,
        eventId: +this.eventId,
        message: this.messageData.value.message!,
        dateTime: new Date(),
      };
  
      this.chatService.sendMessage(messageToSend).subscribe(
        (response) => {
          console.log('Message sent successfully:', response);
          this.newMessage = '';
         // this.messages.push(response);
          this.messageData.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }
}