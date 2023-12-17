import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageReceiveDto } from 'src/app/interfaces/chat-message-receive-dto';
import { ChatService } from 'src/app/services/chat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { ChatMessageSendDto } from 'src/app/interfaces/chat-message-send-dto';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SignalRService } from 'src/app/services/signal-r.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() eventId = '';
  messages: ChatMessageReceiveDto[] = [];
  @ViewChild('myScrollContainer', { static: false })
  myScrollContainer!: ElementRef;
  newMessage: string;
  @Input() userId: number = 0;
  messageData = this.fb.group({
    message: '',
  });

  constructor(
    private chatService: ChatService,
    private toast: NgToastService,
    private fb: FormBuilder,
    private signalRService: SignalRService
  ) {
    this.newMessage = '';
  }

  ngOnInit(): void {
    this.loadAllMessages();

    this.addToEventGroup();
    window.addEventListener('signalRConnected', (e) => this.addToEventGroup());

    this.signalRService.hubConnection.on(
      'ReceiveChatMessage',
      (signalRMessage: ChatMessageReceiveDto) => {
        console.log(signalRMessage);

        if (signalRMessage.userId != this.userId) {
          var responseMessage = signalRMessage;
          responseMessage.dateTime = new Date(signalRMessage.dateTime);
          var stringDate = responseMessage.dateTime.toISOString().slice(0, -1);
          responseMessage.dateTime = new Date(stringDate);

          this.messages.push(signalRMessage);
        }
      }
    );
    this.signalRService.hubConnection.on('EventJoined', (message: string) => {
      console.log(message);
    });
    this.signalRService.hubConnection.on('EventLeft', (message: string) => {
      console.log(message);
    });
  }

  ngOnDestroy(): void {
    this.removeFromEventGroup();
    this.signalRService.hubConnection.off('EventJoined');
    this.signalRService.hubConnection.off('EventLeft');
    this.signalRService.hubConnection.off('ReceiveChatMessage');
    window.removeEventListener('signalRConnected', (e) =>
      this.addToEventGroup()
    ); //niby nie trzeba ale dla pewnosci
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  loadAllMessages() {
    this.chatService.getAllMessages(this.eventId).subscribe({
      next: (res) => {
        this.messages = res;
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }

  sendMessage() {
    if (
      this.messageData.value.message != '' ||
      this.messageData.value.message != null
    ) {
      const messageToSend: ChatMessageSendDto = {
        id: 0,
        userId: this.userId,
        eventId: +this.eventId,
        message: this.messageData.value.message!,
        dateTime: new Date(),
      };

      this.chatService.sendMessage(messageToSend).subscribe(
        (response) => {
          this.newMessage = '';
          var responseMessage = response;

          responseMessage.dateTime = new Date(response.dateTime);
          var stringDate = responseMessage.dateTime.toISOString().slice(0, -1);
          responseMessage.dateTime = new Date(stringDate);

          this.messages.push(responseMessage);
          this.messageData.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  addToEventGroup() {
    if (
      this.signalRService.hubConnection.state ===
      signalR.HubConnectionState.Connected
    ) {
      this.signalRService.hubConnection
        .invoke('AddToEventGroup', this.eventId)
        .catch((err) => console.error(err));
    }
  }

  removeFromEventGroup() {
    if (
      this.signalRService.hubConnection.state ===
      signalR.HubConnectionState.Connected
    ) {
      this.signalRService.hubConnection
        .invoke('RemoveFromEventGroup', this.eventId)
        .catch((err) => console.error(err));
    }
  }
}
