import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {BehaviorSubject } from "rxjs";
import {Router} from "@angular/router";




describe('AuthService', () => {

  let authService: AuthService;

  const user = { uid: 'testUid' };
  let userSubject = new BehaviorSubject(user)
  //let mockAngularFireAuth = MockService(AngularFireAuth);


  const mockSendEmailVerification = jest.fn(() => Promise.resolve(true))
  const mockAngularFireAuth: any = {
    authState: userSubject,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    currentUser: Promise.resolve({
      sendEmailVerification: mockSendEmailVerification
    }),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn(() => Promise.resolve()),
  };

  const mockAngularFirestore : any = {
    doc: jest.fn(),
  };

  let mockRouter: Partial<Router>;
  mockRouter = {
    navigate: jest.fn(),
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: mockAngularFirestore },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: Router, useValue: mockRouter },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks()
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should set user data in local storage when authenticated', () => {


    authService = TestBed.inject(AuthService); // Re-inject to update the service with the new mock value
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(user));
  });

  it('should set user data to null in local storage when not authenticated', () => {
    userSubject.next(null);
    authService = TestBed.inject(AuthService); // Re-inject to update the service with the new mock value

    expect(localStorage.getItem('user')).toEqual('null');
  });

  describe('SignIn', () => {

    it('should sign in successfully and navigate to dashboard', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const mockUser = {
        uid: 'testUserId',
      };
      userSubject.next(mockUser)
      mockAngularFireAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      })
      const spy = jest.spyOn(authService, 'SetUserData').mockImplementation(() => Promise.resolve());
      await authService.SignIn(email, password);

      expect(mockAngularFireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        email,
        password
      );
      expect(spy).toHaveBeenCalledWith(mockUser);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should handle sign-in error', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const errorMessage = 'Sign-in error message';

      mockAngularFireAuth.signInWithEmailAndPassword.mockRejectedValue({
        message: errorMessage,
      });

      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      await authService.SignIn(email, password);

      expect(mockAngularFireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        email,
        password
      );
      expect(alertSpy).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('SignUp', () => {

      describe('SignUp', () => {
        it('should sign up a new user and call SendVerificationMail', async () => {
          const mockUserCredential = {
            user: {
              email: 'test@example.com',
            },
          };

          mockAngularFireAuth.createUserWithEmailAndPassword.mockResolvedValue(
            mockUserCredential
          );

          const sendVerificationMailSpy = jest.spyOn(
            authService,
            'SendVerificationMail'
          ).mockImplementation();
          const setUserDataSpy = jest.spyOn(authService, 'SetUserData').mockImplementation(() => Promise.resolve());

          const email = 'test@example.com';
          const password = 'password123';

          await authService.SignUp(email, password);

          expect(mockAngularFireAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
            email,
            password
          );
          expect(sendVerificationMailSpy).toHaveBeenCalled();
          expect(setUserDataSpy).toHaveBeenCalledWith(mockUserCredential.user);
        });

        it('should show an error alert when sign up fails', async () => {
          const errorMessage = 'Some error message';
          mockAngularFireAuth.createUserWithEmailAndPassword.mockRejectedValue(
            new Error(errorMessage)
          );

          const windowAlertSpy = jest.spyOn(window, 'alert').mockImplementation();

          const email = 'test@example.com';
          const password = 'password123';

          await authService.SignUp(email, password);

          expect(windowAlertSpy).toHaveBeenCalledWith(errorMessage);
        });
      });
    });
  describe('sendEmailVerification', () => {
    it('should call sendEmailVerification and navigate when SendVerificationMail is called', async () => {

      await authService.SendVerificationMail();

      expect(mockSendEmailVerification).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['verify-email-address']);
    });
  });
  describe('ForgotPassword', () => {
    it('should send a password reset email and show success alert', async () => {
      const email = 'test@example.com';
      const sendPasswordResetSpy = jest.spyOn(
        mockAngularFireAuth,
        'sendPasswordResetEmail'
      );

      await authService.ForgotPassword(email);

      expect(sendPasswordResetSpy).toHaveBeenCalledWith(email);
      expect(window.alert).toHaveBeenCalledWith(
        'Password reset email sent, check your inbox.'
      );
    });

    it('should show error alert if sending email fails', async () => {
      const email = 'test@example.com';
      mockAngularFireAuth.sendPasswordResetEmail = jest
        .fn()
        .mockRejectedValue(new Error('Email sending failed'));
      const alertSpy = jest.spyOn(window, 'alert');

      await authService.ForgotPassword(email);

      expect(alertSpy).toHaveBeenCalledWith('Email sending failed');
    });
  });
  describe('isLoggedIn', () => {
    it('should return false if user is null', () => {
      const user = null;
      localStorage.setItem('user', JSON.stringify(user));

      const result = authService.isLoggedIn;

      expect(result).toBe(false);
    });

    it('should return false if user email is not verified', () => {
      const user = { emailVerified: false };
      localStorage.setItem('user', JSON.stringify(user));

      const result = authService.isLoggedIn;

      expect(result).toBe(false);
    });

    it('should return true if user is logged in and email is verified', () => {
      const user = { emailVerified: true };
      localStorage.setItem('user', JSON.stringify(user));

      const result = authService.isLoggedIn;

      expect(result).toBe(true);
    });
  });
  describe('SetUserData', () => {
    it('should set user data', () => {
      const userMock = {
        uid: 'userUid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'user/photo.jpg',
        emailVerified: true,
      };

      const userRefMock = {
        set: jest.fn().mockResolvedValue(Promise.resolve(true)),
      };

      mockAngularFirestore.doc.mockReturnValue(userRefMock);

      const result = authService.SetUserData(userMock);

      expect(mockAngularFirestore.doc).toHaveBeenCalledWith(`users/${userMock.uid}`);
      expect(userRefMock.set).toHaveBeenCalledWith(userMock, { merge: true });
      expect(result).toEqual(Promise.resolve(true));
    });
  });
  describe('SignOut', () => {
    it('should clear local storage and navigate to sign-in', async () => {
      // Arrange
      localStorage.setItem('user', JSON.stringify({ someUserData: 'data' }));
      jest.spyOn(Object.getPrototypeOf(window.localStorage), 'removeItem')
      // Act
      await authService.SignOut();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sign-in']);
    });

    it('should call afAuth.signOut', async () => {
      // Act
      await authService.SignOut();

      // Assert
      expect(mockAngularFireAuth.signOut).toHaveBeenCalled();
    });

    it('should not navigate if signOut fails', async () => {
      // Arrange
      mockAngularFireAuth.signOut = jest.fn(() => Promise.reject());

      // Act
      try {
      await authService.SignOut();
      } catch (e) {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }
      // Assert
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
