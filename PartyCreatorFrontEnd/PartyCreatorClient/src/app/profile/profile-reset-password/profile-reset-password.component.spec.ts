import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResetPasswordComponent } from './profile-reset-password.component';

describe('ProfileResetPasswordComponent', () => {
  let component: ProfileResetPasswordComponent;
  let fixture: ComponentFixture<ProfileResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileResetPasswordComponent]
    });
    fixture = TestBed.createComponent(ProfileResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
