import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import {MockService} from 'ng-mocks';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock = MockService(AuthService);
  let routerMock: Partial<Router>;

  beforeEach(() => {

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access for logged-in user', () => {
    // Arrange
    jest.spyOn(authServiceMock, 'isLoggedIn', 'get').mockReturnValue(true);

    // Act
    const result = guard.canActivate(null!, null!);

    // Assert
    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not allow access for logged-out user', () => {
    // Arrange
    jest.spyOn(authServiceMock, 'isLoggedIn', 'get').mockReturnValue(false);

    // Act
    const result = guard.canActivate(null!, null!) as Observable<boolean | UrlTree>;

    // Assert
    expect(routerMock.navigate).toHaveBeenCalledWith(['sign-in']);
  });
});
