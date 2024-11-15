import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map, switchMap, take } from 'rxjs';

//* Interface imports
import { User } from '@/app/interfaces/user';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { AuthService } from '@/app/services/auth.service';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  // User subject to hold the current user
  private userSubject = new BehaviorSubject<User | null>(null);
  // Observable to get the current user
  user$: Observable<User | null> = this.userSubject.asObservable();


  // Constructor with dependency injections
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { this.initUser(); }

  // Function to initialize user
  private initUser(): void {
    // If the user is authenticated with an auth token,
    if (localStorage.getItem('token')) {
      // Get the user from the API
      this.apiService.getUser().subscribe((response: User) => {
        // Set the user subject
        this.userSubject.next(response);
      }, (error: HttpErrorResponse) => {
        // Handle the error
        console.error('Error fetching user:', error);
        // Log out the user
        this.authService.logout();
      });
    }
  }

  // Function to get user
  getUser(): Observable<User | null> {
    // Get the current user
    return this.user$.pipe(
      tap((user) => {
        // If user is null, initialize it
        if (!user) {
          this.initUser();
        }
      }),
      // Return the user
      map((response: any | null) => response?.data),
      catchError((error) => {
        // Handle the error
        console.error('Error getting user:', error);
        return throwError(() => error);
      })
    );
  }


  // Function to update user
  updateUser(user: User, originalUser: User): Observable<any> {
    // Create a copy of the original user
    const updatedUser: User = { ...originalUser };

    // Update the fields that have changed
    Object.keys(user).forEach((key) => {
      if (user[key] !== originalUser[key]) {
        updatedUser[key] = user[key];
      }
    });

    // Update the user
    return this.apiService.updateUser(updatedUser).pipe(
      // Send the updated user to the API
      switchMap(() => this.apiService.getUser()),
      // Update the user subject as well
      tap((updatedUser) => this.userSubject.next(updatedUser)),
      // Handle errors
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }


  // Function to delete user account
  deleteUser(): Observable<User> {
    // Get the current user
    return this.user$.pipe(
      take(1),
      switchMap((response) => {
        // Check if user data is available
        if (!response?.['data']) {
          console.error('Données utilisateur non trouvées');
          throw new Error('Données utilisateur non trouvées');
        }

        const user = response['data'];

        // Extract the user ID
        const userId = user.id;

        // Delete the user account associated with the ID
        return this.apiService.deleteUser(userId).pipe(
          catchError((error) => {
            // Handle the error
            console.error('Erreur de suppression:', error);
            throw error;
          })
        );
      })
    );
  }
}