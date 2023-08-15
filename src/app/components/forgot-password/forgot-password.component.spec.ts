import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import {AuthService} from "../../shared/services/auth.service";

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      ForgotPassword: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.ForgotPassword on form submission', () => {
    // Arrange
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="email"]');
    const submitButton: HTMLInputElement = fixture.nativeElement.querySelector('input[type="submit"]');

    // Act
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    submitButton.click();
    fixture.detectChanges();

    // Assert
    expect(authServiceMock.ForgotPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('should have the correct router link for Log In', () => {
    // Arrange
    const redirectLink: HTMLAnchorElement = fixture.nativeElement.querySelector('.redirect');

    // Assert
    expect(redirectLink.getAttribute('routerLink')).toBe('/sign-in');
  });
});
