import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyEmailComponent } from './verify-email.component';
import { By } from '@angular/platform-browser';
import {AuthService} from "../../shared/services/auth.service";
import {Router, UrlTree} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let authServiceMock: Partial<AuthService>;
  let router: Router;

  beforeEach(() => {
    authServiceMock = {
      userData: { email: 'test@example.com' },
      SendVerificationMail: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [VerifyEmailComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display email and resend button when userData is available', () => {
    // Arrange
    component.authService.userData = { email: 'test@example.com' };
    fixture.detectChanges();

    // Act
    const emailElement = fixture.debugElement.query(By.css('.text-center strong'));
    const resendButton = fixture.debugElement.query(By.css('.btnPrimary'));

    // Assert
    expect(emailElement.nativeElement.textContent).toContain('test@example.com');
    expect(resendButton).toBeTruthy();
  });

  it('should call SendVerificationMail when resend button is clicked', () => {
    // Arrange
    const resendButton = fixture.debugElement.query(By.css('.btnPrimary'));

    // Act
    resendButton.triggerEventHandler('click', null);

    // Assert
    expect(authServiceMock.SendVerificationMail).toHaveBeenCalled();
  });

  it('should navigate to sign-in when "Sign in" link is clicked', () => {
    // Arrange
    const routerLink = fixture.debugElement.query(By.css('.redirect'));
    const navSpy = jest.spyOn(router, 'navigateByUrl');

    // Act
    routerLink.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    expect(router.serializeUrl(navSpy.mock.calls[0][0] as UrlTree)).toBe('/sign-in');
  });
});
