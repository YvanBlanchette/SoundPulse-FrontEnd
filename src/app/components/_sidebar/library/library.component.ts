// library.component.ts
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil, map, Observable } from 'rxjs';
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';

//* Component imports
import { LibraryItemComponent } from '@/app/components/_sidebar/library-item/library-item.component';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { LibraryService } from '@/app/services/library.service';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryItemComponent, MatIconModule, AsyncPipe, NgIf, NgFor],
  templateUrl: './library.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})


export class LibraryComponent implements OnInit, OnDestroy, OnChanges {
  // Variables
  @Input() filter: string = 'all';
  isLoading = true;
  errorMessage = '';


  // Constructor with dependency injection
  constructor(
    private libraryService: LibraryService,
    private cdr: ChangeDetectorRef) {}


  // Subjects
  private ngUnsubscribe = new Subject();
  libraryItems$: Observable<LibraryItem[] | null> | null = null;
  filteredLibraryItems$: Observable<LibraryItem[] | null> | null = null;

  trackItem(index: number, item: LibraryItem) {
    return item.id;
  }

  // On Initialize component
  ngOnInit(): void {
    this.libraryItems$ = this.libraryService.library$;
    this.filteredLibraryItems$ = this.libraryItems$.pipe(
      map((libraryItems) => this.filterItems(libraryItems)),
      takeUntil(this.ngUnsubscribe)
    );
    this.libraryItems$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des éléments de la bibliothèque:', error);
        this.isLoading = false;
        this.errorMessage = error.message;
      }
    });
  }


  // On Destroy component
  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }


  // On changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter']) {
      this.filteredLibraryItems$ = this.libraryItems$?.pipe(
        map((libraryItems) => this.filterItems(libraryItems)),
        takeUntil(this.ngUnsubscribe)
      ) ?? null; // Add nullish coalescing operator
    } else {
      this.filteredLibraryItems$ = null; // Ensure it's reset to null
    }
  }


  // Filter library items by type
  filterItems(libraryItems: LibraryItem[] | null): LibraryItem[] | null {
    if (libraryItems) {
      switch (this.filter) {
        case 'artist':
          return libraryItems.filter((item) => item.type === 'Artist');
        case 'album':
          return libraryItems.filter((item) => item.type === 'Album');
        case 'playlist':
          return libraryItems.filter((item) => item.type === 'Playlist');
        default:
          return libraryItems;
      }
    }
    return null;
  }


  // Remove a library item
  removeItem(id: string): void {
    this.libraryService.removeLibraryItem(id).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Une erreur s\'est produite lors de la suppression:', error);
      }
    });
  }
}