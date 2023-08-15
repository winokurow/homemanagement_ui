import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { AuthService } from '../../shared/services/auth.service';
import { By } from '@angular/platform-browser';
import {Router, UrlTree} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authServiceMock: Partial<AuthService>;
  let router: Router;

  beforeEach(() => {
    authServiceMock = {
      SignIn: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
    });

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.SignIn when the login button is clicked', () => {
    // Arrange
    const userNameInput = fixture.debugElement.query(By.css('input[type="text"]'));
    const userPasswordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    const loginButton = fixture.debugElement.query(By.css('input[type="button"]'));

    userNameInput.nativeElement.value = 'testuser';
    userPasswordInput.nativeElement.value = 'testpassword';

    // Act
    loginButton.triggerEventHandler('click', null);

    // Assert
    expect(authServiceMock.SignIn).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('should navigate to /forgot-password when the "Forgot Password?" link is clicked', () => {
    // Arrange
    const navSpy = jest.spyOn(router, 'navigateByUrl');
    const forgotPasswordLink = fixture.nativeElement.querySelector('.forgotPassword span');

    // Act
    forgotPasswordLink.click();

    // Assert
    expect(router.serializeUrl(navSpy.mock.calls[0][0] as UrlTree)).toBe('/forgot-password');
  });

  it('should navigate to /register-user when the "Sign Up" link is clicked', () => {
    // Arrange
    const navSpy = jest.spyOn(router, 'navigateByUrl');
    const signUpLink = fixture.nativeElement.querySelector('.redirectToLogin .redirect');

    // Act
    signUpLink.click();

    // Assert
    expect(router.serializeUrl(navSpy.mock.calls[0][0] as UrlTree)).toBe('/register-user');
  });
});
