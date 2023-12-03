import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
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
  }[] = [];
  newItemName: string = '';
  newItemQuantity: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private toast: NgToastService,
    private router: Router,
    private shoppingListService: ShoppingListService,
    public dialog: MatDialog
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.selected = null;
    this.eventDetails = {
      id: 0,
      creatorId: 0,
      creatorName: '',
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
    //to ponizej powinno byc w osobnej funkcji!!!
    const eventId = Number(this.eventId);
    this.shoppingListService.getShoppingList(eventId).subscribe((data) => {
      this.shoppingList = data;
    });
    //}
  }

  loadEventDetails(): void {
    const eventId: string | null = this.route.snapshot.paramMap.get('id');
    if (eventId !== null) {
      this.eventService.getEventDetails(eventId).subscribe(
        (data: EventUserDto | null) => {
          if (data !== null) {
            this.eventDetails = data;
            this.eventService
              .getGuestsUsers(data.id.toString())
              .subscribe((users) => (this.guestsUsers = users));
            this.eventService
              .getInvitesUsers(data.id.toString())
              .subscribe((users) => (this.invitesUsers = users));
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

  openDialog() {
    const dialogRef = this.dialog.open(InviteModalComponent, {
      data: {
        eventId: this.eventId,
        guests: this.guestsUsers,
        invites: this.invitesUsers,
      },
      panelClass: 'inviteDialog',
      backdropClass: 'dialogBackgroundClass',
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.loadInvitedUsers();
      this.loadGuestUsers();
    });
  }

  toggleMapVisibility(): void {
    if (this.isMapVisible) {
      this.isMapVisible = false;
    } else {
      // Wyszukiwanie koordynatów tylko, gdy mapa jest ustawiona na widoczność
      this.findMapCoordinates();
    }
  }

  goToUserProfile(userId: number): void {
    this.router.navigate(['/profil', userId]);
  }

  private findMapCoordinates(): void {
    const addressToGeocode =
      this.eventDetails?.address + ', ' + this.eventDetails?.city;

    if (addressToGeocode) {
      const provider = new leafletGeosearch.OpenStreetMapProvider();

      provider
        .search({ query: addressToGeocode })
        .then((result: any) => {
          if (result.length > 0) {
            this.isMapVisible = true;
          } else {
            this.toast.error({
              detail: 'Mapa nie potrafiła znaleźć tego adresu.',
              duration: 3000,
            });
            // Dodaj odpowiedni kod, aby wyświetlić komunikat o błędzie (np. Angular Material Snackbar)
            console.error('Mapa nie potrafiła znaleźć tego adresu.');
          }
        })
        .catch((error: any) => {
          // Dodaj odpowiedni kod, aby wyświetlić komunikat o błędzie (np. Angular Material Snackbar)
          console.error('Błąd podczas geokodowania:', error);
          console.error('Mapa nie potrafiła znaleźć tego adresu.');
          this.toast.error({
            detail: 'Mapa nie potrafiła znaleźć tego adresu.',
            duration: 3000,
          });
        });
    }
  }

  loadInvitedUsers() {
    this.eventService
      .getInvitesUsers(this.eventDetails.id.toString())
      .subscribe((users) => (this.invitesUsers = users));
  }
  loadGuestUsers() {
    this.eventService
      .getGuestsUsers(this.eventDetails.id.toString())
      .subscribe((users) => (this.guestsUsers = users));
  }

  loadShoppingList() {
    this.shoppingListService.getShoppingList(this.eventDetails.id).subscribe(
      (shoppingList) => {
        this.shoppingList = shoppingList;
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
    this.shoppingListService.deleteItem(Number(this.eventId), itemId).subscribe(
      () => {
        this.loadShoppingList(); // odśwież listę po usunięciu przedmiotu
      },
      (error) => {
        console.error('Wystąpił błąd podczas usuwania przedmiotu', error);
      }
    );
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
}
