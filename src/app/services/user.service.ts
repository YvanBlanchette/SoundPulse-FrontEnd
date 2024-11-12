import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, map, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { User } from '@/app/interfaces/user';
import { LoginResponse } from '@/app/interfaces/login-response';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.initUser();
  }

  //! Function to initialize user
  private initUser(): void {
    if (localStorage.getItem('token')) {
      this.apiService.getUser().subscribe((response: User) => {
        this.userSubject.next(response);
      }, (error: HttpErrorResponse) => {
        console.error('Error fetching user:', error);
        this.logout();
      });
    }
  }

//! Function to get user observable
getUser(): Observable<User | null> {
  return this.user$.pipe(
    tap((user) => {
      if (!user) {
        this.initUser();
      }
    }),
    map((response: any | null) => response?.data),
    catchError((error) => {
      console.error('Error getting user:', error);
      return throwError(() => error);
    })
  );
  }
  

//! Function to get the current user id
  getCurrentUserId(): number | undefined {
    const user = this.userSubject.getValue();
    if (user) {
      return user.id;
    } else {
      return undefined;
    }
}


//! Function to update user
updateUser(user: User, originalUser: User): Observable<any> {
  const updatedUser: User = { ...originalUser };

  Object.keys(user).forEach((key) => {
    if (user[key] !== originalUser[key]) {
      updatedUser[key] = user[key];
    }
  });

  return this.apiService.updateUser(updatedUser).pipe(
    switchMap(() => this.apiService.getUser()),
    tap((updatedUser) => this.userSubject.next(updatedUser)),
    catchError((error: HttpErrorResponse) => {
      console.error('Error updating user:', error);
      return throwError(() => error);
    })
  );
}

  //! Function to logout user
  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}