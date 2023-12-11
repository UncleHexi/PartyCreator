import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageReceiveDto } from 'src/app/interfaces/chat-message-receive-dto';
import { ChatService } from 'src/app/services/chat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ChatComponent implements OnInit {
  @Input() eventId = '';
  @Input() messages: ChatMessageReceiveDto[] = [];
  constructor(
    private chatService: ChatService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {}
}
