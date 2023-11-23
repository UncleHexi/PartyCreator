import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup/signup.component';
import { SigninComponent } from './login/signin/signin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainComponent } from './main/main.component';
import { NavMenuMainComponent } from './nav-menu-main/nav-menu-main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EventViewComponent } from './event-view/event-view.component';
import { ProfileComponent } from './profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { ProfileContactsComponent } from './profile/profile-contacts/profile-contacts.component';
import { AddContactDialogComponent } from './profile/add-contact-dialog/add-contact-dialog.component';
import { DatePipe } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileEditAvatarComponent } from './profile/profile-edit/profile-edit-avatar/profile-edit-avatar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MainCalendarComponent } from './main/main-calendar/main-calendar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    SigninComponent,
    EventViewComponent,
    ProfileComponent,
    MapComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    HttpClientModule,
    NgToastModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    ProfileEditComponent,
    DatePipe,
    ProfileViewComponent,
    ProfileContactsComponent,
    AddContactDialogComponent,
    MatMenuModule,
    ProfileEditAvatarComponent,
    MainComponent,
    NavMenuMainComponent,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MainCalendarComponent,
    MatTooltipModule,
    UserProfileComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    [DatePipe],
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
