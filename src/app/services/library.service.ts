import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, ReplaySubject, filter, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Library } from '@/app/interfaces/library';
import { LibraryItem } from '../interfaces/library-item';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private librarySubject = new ReplaySubject<LibraryItem[] | null>(1);
  library$: Observable<LibraryItem[] | null> = this.librarySubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.initLibrary();
  }

  //! Function to initialize library
  private initLibrary(): void {
    this.apiService.getFormattedLibraryItems().subscribe((response: LibraryItem[]) => {
      this.librarySubject.next(response);
    }, (error: HttpErrorResponse) => {
      console.error('Error fetching user:', error);
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
}