import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError, ReplaySubject, filter, switchMap, map } from 'rxjs';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LibraryItem } from '../interfaces/library-item';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private librarySubject = new ReplaySubject<LibraryItem[] | null>(1);
  library$: Observable<LibraryItem[] | null> = this.librarySubject.asObservable();

  constructor(
    private apiService: ApiService,
  ) {
    this.initLibrary();
  }

  //! Function to initialize library
  private initLibrary(): void {
    this.apiService.getFormattedLibraryItems().subscribe({
      next: (response: LibraryItem[]) => {
        this.librarySubject.next(response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  
//! Function to get library observable
getLibraryItems(): Observable<LibraryItem[]> {
  return this.library$.pipe(
    tap((library) => {
      if (!library) {
        this.initLibrary();
      }
    }),
    filter((library): library is LibraryItem[] => library !== null),
    catchError((error) => {
      console.error('Error getting library:', error);
      return throwError(() => error);
    })
  );
}

  
//! Function to add item to library
addLibraryItem(item: LibraryItem): Observable<LibraryItem[]> {
  return this.apiService.addLibraryItem(item).pipe(
    switchMap(() => this.apiService.getLibraryItems()),
    tap((libraryItems) => {
      this.librarySubject.next([...libraryItems]);
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error adding library item:', error);
      return throwError(() => new Error(`Failed to add library item: ${error.error.message}`));
    })
  );
}


//! Function to remove item from library
removeLibraryItem(id: string): Observable<LibraryItem[]> {
  return this.apiService.removeLibraryItem(id).pipe(
    switchMap((response) => {
      return this.apiService.getLibraryItems();
    }),
    tap((libraryItems) => {
      this.librarySubject.next([...libraryItems]);
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error removing library item:', error);
      return throwError(() => new Error(`Failed to remove library item: ${error.error.message}`));
    })
  );
  }
  

  //! Function to check if item is in library
  isItemInLibrary(id: string): Observable<boolean> {
    return this.library$.pipe(
      map((libraryItems) => libraryItems?.some((item) => item.id === id) ?? false)
    );
  }
}