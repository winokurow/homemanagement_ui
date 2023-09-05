import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {AuthService} from "../../../shared/services/auth.service";
import {Router, UrlTree} from "@angular/router";

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authServiceMock: Partial<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      SignUp: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService SignUp method with email and password on button click', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    const signUpButton = fixture.debugElement.query(By.css('.btnPrimary'));

    emailInput.nativeElement.value = 'test@example.com';
    passwordInput.nativeElement.value = 'password123';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    signUpButton.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceMock.SignUp).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should navigate to sign-in page when "Log In" link is clicked', () => {
    const redirectLink = fixture.debugElement.query(By.css('.redirect'));
    const navSpy = jest.spyOn(router, 'navigateByUrl');

    redirectLink.nativeElement.click();

    expect(router.serializeUrl(navSpy.mock.calls[0][0] as UrlTree)).toBe('/sign-in');
  });
});
