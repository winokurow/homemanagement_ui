import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes, AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';

describe('AppRoutingModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [
        SignInComponent,
        SignUpComponent,
        DashboardComponent,
        ForgotPasswordComponent,
        VerifyEmailComponent,
      ],
      providers: [AuthGuard],
    });
  });

  it('should have a route for empty path that redirects to sign-in', () => {
    const route = routes.find((r) => r.path === '' && r.redirectTo);
    expect(route.redirectTo).toBe('/sign-in');
  });

  it('should have a route for sign-in', () => {
    const route = routes.find((r) => r.path === 'sign-in');
    expect(route).toBeDefined();
    expect(route!.component).toBe(SignInComponent);
  });

  it('should have a route for register-user', () => {
    const route = routes.find((r) => r.path === 'register-user');
    expect(route).toBeDefined();
    expect(route!.component).toBe(SignUpComponent);
  });

  it('should have a route for dashboard with AuthGuard', () => {
    const route = routes.find((r) => r.path === 'dashboard');
    expect(route).toBeDefined();
    expect(route!.component).toBe(DashboardComponent);
    expect(route!.canActivate).toEqual([AuthGuard]);
  });

  it('should have a route for forgot-password', () => {
    const route = routes.find((r) => r.path === 'forgot-password');
    expect(route).toBeDefined();
    expect(route!.component).toBe(ForgotPasswordComponent);
  });

  it('should have a route for verify-email-address', () => {
    const route = routes.find((r) => r.path === 'verify-email-address');
    expect(route).toBeDefined();
    expect(route!.component).toBe(VerifyEmailComponent);
  });
});
