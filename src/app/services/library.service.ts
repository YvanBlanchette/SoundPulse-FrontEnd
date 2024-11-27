import { ChangeDetectorRef, Injectable } from '@angular/core';
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


  // Constructor with dependency injections
  constructor(
    private apiService: ApiService,
  ) { this.initLibrary(); }


  // Function to initialize the library
  private initLibrary(): void {
    // Get formatted library items from the API
    this.apiService.getFormattedLibraryItems().subscribe({
      next: (response: LibraryItem[]) => {
        // Parse images and update the library subject
        const parsedResponse = response.map((item) => ({
          ...item,
          images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images,
        }));
        this.librarySubject.next(parsedResponse);
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
        // Parse images and update the library
        const parsedLibraryItems = libraryItems.map((item) => ({
          ...item,
          images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images,
        }));
        this.librarySubject.next(parsedLibraryItems);
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
    return this.apiService.removeLibraryItem(id).pipe(
      switchMap((response) => {
        return this.apiService.getLibraryItems();
      }),
      tap((libraryItems) => {
        // Check if libraryItems is an array
        if (Array.isArray(libraryItems)) {
          // Parse images and update the library
          const parsedLibraryItems = libraryItems.map((item) => ({
            ...item,
            images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images,
          }));
          this.librarySubject.next(parsedLibraryItems);
        } else {
          // Handle the case where libraryItems is not an array
          this.librarySubject.next([]);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Une erreur s\'est produite lors de la suppression de l\'élément de la bibliothèque:', error);
        return throwError(() => new Error(`Une erreur s\'est produite lors de la suppression de l\'élément de la bibliothèque: ${error.error.message}`));
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