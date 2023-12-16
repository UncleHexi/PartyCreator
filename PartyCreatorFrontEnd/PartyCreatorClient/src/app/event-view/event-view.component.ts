import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import {
  faLocationDot,
  faCheck,
  faCalendar,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import * as leafletGeosearch from 'leaflet-geosearch';
import { RoleDto } from '../interfaces/role-dto';
import { MatDialog } from '@angular/material/dialog';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';
import { AllGuestsListDto } from '../interfaces/all-guests-list-dto';
import { EventUserDto } from '../interfaces/event-user-dto';
import { ShoppingListService } from '../services/shopping-list.service';
import { ExtraFunctionsModalComponent } from '../extra-functions-modal/extra-functions-modal.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ShoppingListItemDto } from '../interfaces/shopping-list-item-dto';
import { ChatService } from '../services/chat.service';
import { ChatMessageReceiveDto } from '../interfaces/chat-message-receive-dto';
import { MapComponent } from '../map/map.component';
import { GalleryService } from '../services/gallery.service';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { PhotoDto } from '../interfaces/photo-dto';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css'],
  animations: [
    trigger('slideDown', [
      state('void', style({ height: '0', opacity: '0' })),
      state('*', style({ height: '*', opacity: '1' })),
      transition('void <=> *', animate('500ms ease-in-out')),
    ]),
    trigger('pulse', [
      state('rest', style({ transform: 'scale(1)' })),
      state('pulse', style({ transform: 'scale(1.2)' })),
      transition('rest <=> pulse', animate('500ms ease-in-out')),
    ]),
  ],
})
export class EventViewComponent implements OnInit {
  faArrowRight: any;
  selected: Date | null;
  eventDetails: EventUserDto;

  faClock = faClock;
  faCalendar = faCalendar;
  faLocationDot = faLocationDot;
  faCheck = faCheck;
  isThingsToBringVisible: boolean = false;
  isMapVisible: boolean = false;

  arrowAnimationState: string = 'rest';

  images: PhotoDto[] = [];

  guestsUsers: AllGuestsListDto[] = [];
  invitesUsers: AllGuestsListDto[] = [];
  userRole: RoleDto = { id: 0, role: '' };
  eventId = '';
  editMode = false;
  editField: string | null = null;
  editedTime: string = '';
  editedDate: string = '';
  isSuccess: number = 0;
  shoppingList: {
    userId: number;
    id: number;
    name: string;
    quantity: number;
    firstName: string;
    lastName: string;
  }[] = [];
  newItemName: string = '';
  newItemQuantity: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private toast: NgToastService,
    private router: Router,
    private shoppingListService: ShoppingListService,
    public dialog: MatDialog,
    private chatService: ChatService,
    private galleryService: GalleryService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.selected = null;
    this.eventDetails = {
      id: 0,
      creatorId: 0,
      creatorFirstName: '',
      creatorLastName: '',
      title: '',
      description: '',
      dateTime: new Date(),
      city: '',
      address: '',
      country: '',
      color: '',
      playlistTitle: '',
      shoppingListTitle: '',
      receiptTitle: '',
    };
  }

  ngOnInit() {
    this.authorization();
    //jakims chujem nie dziala
    //if(this.userRole.id!=0)
    //{
    this.loadEventDetails();
    this.loadAllMessages();
    this.loadImages();
  }

  //Event methods
  authorization() {
    //tutaj naprawic te returny
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.eventService.getAccess(this.eventId).subscribe({
      next: (res) => {
        this.userRole = res;
        console.log(this.userRole);
      },
      error: (err: HttpErrorResponse) => {
        this.router.navigate([`wydarzenia`]);
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }

  loadEventDetails(): void {
    const eventId: string | null = this.route.snapshot.paramMap.get('id');
    if (eventId !== null) {
      this.eventService.getEventDetails(eventId).subscribe(
        (data: EventUserDto | null) => {
          if (data !== null) {
            this.eventDetails = data;
            this.loadGuestsUsers();
            this.loadInvitedUsers();
            this.loadShoppingList();
          } else {
            console.error('Otrzymano nullowe dane z serwera');
          }
        },
        (error: any) => {
          console.error(
            'Wystąpił błąd podczas pobierania szczegółów wydarzenia',
            error
          );
        }
      );
    } else {
      console.error('ID wydarzenia jest nullem lub niezdefiniowane');
    }
  }

  loadImages() {
    this.galleryService.GetImagesFromEvent(Number(this.eventId)).subscribe({
      next: (res) => {
        this.images = res;
        console.log('Images:', this.images);
      },
      error: (error) => {
        console.error('Error fetching images', error);
      },
    });
  }

  goToUserProfile(userId: number): void {
    this.router.navigate(['/profil', userId]);
  }

  loadGuestsUsers() {
    this.eventService
      .getGuestsUsers(this.eventDetails!.id.toString())
      .subscribe((users) => {
        this.guestsUsers = users;
        this.guestsUsers.unshift({
          id: this.eventDetails.creatorId,
          firstName: this.eventDetails.creatorFirstName,
          lastName: this.eventDetails.creatorLastName,
        });
      });
  }

  loadInvitedUsers() {
    this.eventService
      .getInvitesUsers(this.eventDetails!.id.toString())
      .subscribe((users) => {
        this.invitesUsers = users;
      });
  }

  saveChanges() {
    this.editMode = false;
    this.editField = null;

    console.log('Edited Date:', this.editedDate);
    console.log('Edited Time:', this.editedTime);

    let dateToUse = this.editedDate;
    if (!this.editedDate) {
      dateToUse = new Date(this.eventDetails.dateTime)
        .toISOString()
        .split('T')[0];
    }

    let timeToUse = this.editedTime;
    if (!this.editedTime) {
      timeToUse = new Date(this.eventDetails.dateTime)
        .toISOString()
        .split('T')[1]
        .substring(0, 5);
    }

    if (!dateToUse || !timeToUse) {
      console.error('Nieprawidłowy format daty lub czasu');
      return;
    }

    if (
      dateToUse.match(/^\d{4}-\d{2}-\d{2}$/) &&
      timeToUse.match(/^\d{2}:\d{2}$/)
    ) {
      const updatedDate = new Date(Date.parse(dateToUse));
      const updatedTime = timeToUse.split(':');
      updatedDate.setHours(Number(updatedTime[0]));
      updatedDate.setMinutes(Number(updatedTime[1]));

      console.log('Updated Date:', updatedDate);

      this.eventDetails.dateTime = updatedDate;

      this.eventService
        .updateEventDetails(this.eventId, this.eventDetails)
        .subscribe(
          (response) => {},
          (error) => {
            console.error('Błąd podczas aktualizacji danych wydarzenia', error);
          }
        );
    } else {
      console.error('Nieprawidłowy format daty lub czasu');
    }
  }

  @ViewChild('fileUploader') fileUploader: FileUpload | undefined;

  uploadFile(event: any) {
    // event.files zawiera wybrane pliki
    const formData: FormData = new FormData();
    formData.append('file', event.files[0], event.files[0].name);
    formData.append('eventId', this.eventId.toString());
    formData.append('userId', this.userRole.id.toString());

    this.galleryService.UploadImage(formData).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Plik został przesłany!',
          duration: 3000,
        });
        this.images.push(res);
        if (this.fileUploader) {
          this.fileUploader.clear();
        }
      },
      error: (error) => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Błąd podczas przesyłania pliku',
          duration: 3000,
        });
      },
    });
  }

  onUpload(event: any) {
    this.fileUploader?.clear();
  }

  //ShoppingList
  loadShoppingList() {
    this.shoppingListService.getShoppingList(this.eventDetails.id).subscribe(
      (shoppingList: ShoppingListItemDto[]) => {
        this.shoppingList = shoppingList.map((item: ShoppingListItemDto) => {
          const user = this.guestsUsers.find((user) => user.id === item.userId);
          return {
            ...item,
            firstName: user ? user.firstName : '',
            lastName: user ? user.lastName : '',
          };
        });
      },
      (error) => {
        console.error('Wystąpił błąd podczas ładowania listy zakupów', error);
      }
    );
  }

  addItem() {
    if (this.newItemName && this.newItemQuantity > 0) {
      const newItem = {
        id: 0,
        userId: 0,
        eventId: this.eventId,
        name: this.newItemName,
        quantity: this.newItemQuantity,
      };

      this.shoppingListService
        .addNewItem(Number(this.eventId), newItem)
        .subscribe(
          () => {
            this.loadShoppingList();
            this.newItemName = '';
            this.newItemQuantity = 0;
          },
          (error) => {
            console.error(
              'Wystąpił błąd podczas dodawania nowego przedmiotu',
              error
            );
          }
        );
    }
  }

  deleteItem(itemId: number) {
    this.shoppingListService
      .deleteItem(Number(this.eventDetails.id), itemId)
      .subscribe(
        (response) => {
          console.log('Przedmiot został usunięty', response);
          // Aktualizacja lokalnej listy przedmiotów - usuń przedmiot z listy
          this.shoppingList = this.shoppingList.filter(
            (item) => item.id !== itemId
          );
        },
        (error) => {
          console.error('Wystąpił błąd podczas usuwania przedmiotu', error);
        }
      );
  }

  signUpForItem(itemId: number) {
    this.shoppingListService.signUpForItem(itemId).subscribe(
      () => {
        this.loadShoppingList(); // odśwież listę po zapisaniu się na przedmiot
      },
      (error) => {
        console.error(
          'Wystąpił błąd podczas zapisywania się na przedmiot',
          error
        );
      }
    );
  }

  signOutFromItem(itemId: number) {
    this.shoppingListService.signOutFromItem(itemId).subscribe(
      () => {
        this.loadShoppingList(); // odśwież listę po wypisaniu się z przedmiotu
      },
      (error) => {
        console.error(
          'Wystąpił błąd podczas wypisywania się z przedmiotu',
          error
        );
      }
    );
  }

  //Dialogs
  openDialog() {
    const dialogRef = this.dialog.open(InviteModalComponent, {
      data: {
        eventId: this.eventId,
        guests: this.guestsUsers.slice(1),
        invites: this.invitesUsers,
      },
      panelClass: 'inviteDialog',
      backdropClass: 'dialogBackgroundClass',
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.loadInvitedUsers();
    });
  }

  openAddContentModal(): void {
    const dialogRef = this.dialog.open(ExtraFunctionsModalComponent, {
      height: '330px',
      width: '600px',
      data: {
        eventId: this.eventDetails.id,
        hasShoppingList: !!this.eventDetails.shoppingListTitle,
        hasPlaylist: !!this.eventDetails.playlistTitle,
        hasReceipt: !!this.eventDetails.receiptTitle,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed with result:', result);
    });
  }

  //Chat
  messages: ChatMessageReceiveDto[] = [];

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

  
  openMapModal() {
    const addressToGeocode = this.eventDetails.address + ', ' + this.eventDetails.city;
  
    if (addressToGeocode) {
      const provider = new leafletGeosearch.OpenStreetMapProvider();
      provider
        .search({ query: addressToGeocode })
        .then((result: any) => {
          if (result.length > 0) {
            const dialogRef = this.dialog.open(MapComponent, {
              width: '80vw', // lub inny rozmiar
              data: { 
                eventAddress: this.eventDetails.address + ', ' + this.eventDetails.city,
                coordinates: result[0] // przekazanie koordynatów do komponentu MapComponent
              },
            });
          } else {
            this.toast.error({
              detail: 'Mapa nie potrafiła znaleźć tego adresu.',
              duration: 3000,
            });
            console.error('Mapa nie potrafiła znaleźć tego adresu.');
          }
        })
        .catch((error: any) => {
          console.error('Błąd podczas geokodowania:', error);
          console.error('Mapa nie potrafiła znaleźć tego adresu.');
          this.toast.error({
            detail: 'Mapa nie potrafiła znaleźć tego adresu.',
            duration: 3000,
          });
        });
    }
  }
  
}