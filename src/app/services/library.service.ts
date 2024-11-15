import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError, ReplaySubject, filter, switchMap, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { ApiService } from '@/app/services/api.service';


@Injectable({
  providedIn: 'root'
})


export class LibraryService {
  // Library Subject and Observable
  private librarySubject = new ReplaySubject<LibraryItem[] | null>(1);
  library$: Observable<LibraryItem[] | null> = this.librarySubject.asObservable();


  // Constructor with dependencie injections
  constructor(
    private apiService: ApiService,
  ) { this.initLibrary(); }


  // Function to initialize the library
  private initLibrary(): void {
    // Get formatted library items from the API
    this.apiService.getFormattedLibraryItems().subscribe({
      next: (response: LibraryItem[]) => {
        // Update the library subject
        this.librarySubject.next(response);
      },
      error: (error: HttpErrorResponse) => {
        // Handle the error
        console.error('Error fetching user:', error);
      }
    });
  }


  // Function to get library observable
  getLibraryItems(): Observable<LibraryItem[]> {
    return this.library$.pipe(
      tap((library) => {
        // If library is null, initialize it
        if (!library) {
          this.initLibrary();
        }
      }),
      // Filter out null values
      filter((library): library is LibraryItem[] => library !== null),
      catchError((error) => {
        // Handle the error
        console.error('Error getting library:', error);
        return throwError(() => error);
      })
    );
  }


  // Function to add item to library
  addLibraryItem(item: LibraryItem): Observable<LibraryItem[]> {
    // Add the item to the API
    return this.apiService.addLibraryItem(item).pipe(
      // Get the library items
      switchMap(() => this.apiService.getLibraryItems()),
      tap((libraryItems) => {
        // Update the library
        this.librarySubject.next([...libraryItems]);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error
        console.error('Error adding library item:', error);
        return throwError(() => new Error(`Failed to add library item: ${error.error.message}`));
      })
    );
  }


  // Function to remove item from library
  removeLibraryItem(id: string): Observable<LibraryItem[]> {
    // Remove the item from the library
    return this.apiService.removeLibraryItem(id).pipe(
      // Get the library items
      switchMap((response) => {
        // Return the library items
        return this.apiService.getLibraryItems();
      }),
      tap((libraryItems) => {
        // Update the library
        this.librarySubject.next([...libraryItems]);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error
        console.error('Error removing library item:', error);
        return throwError(() => new Error(`Failed to remove library item: ${error.error.message}`));
      })
    );
  }


  // Function to check if item is in library
  isItemInLibrary(id: string): Observable<boolean> {
    return this.library$.pipe(
      map((libraryItems) => libraryItems?.some((item) => item.id === id) ?? false)
    );
  }
}