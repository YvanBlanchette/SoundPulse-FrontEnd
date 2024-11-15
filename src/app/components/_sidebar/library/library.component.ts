import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

//* Component imports
import { LibraryItemComponent } from '@/app/components/_sidebar/library-item/library-item.component';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { LibraryService } from '@/app/services/library.service';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryItemComponent, MatIconModule],
  templateUrl: './library.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})


export class LibraryComponent implements OnInit, OnDestroy, OnChanges {
  // Variables
  @Input() filter: string = 'all';
  libraryItems: LibraryItem[] | null = null;
  selectedItem: LibraryItem | null = null;
  favouriteSongs: LibraryItem[] | null = null;
  isLoading = true;
  errorMessage = '';
  filteredLibraryItems: LibraryItem[] | null = null;


  // Constructor with dependency injection
  constructor(
    private libraryService: LibraryService,
    private cdr: ChangeDetectorRef) {}

  // Subjects
  private ngUnsubscribe = new Subject();


  // On Initialize component
  ngOnInit(): void {
    this.cdr.detectChanges();
    this.libraryService.library$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (libraryItems) => {
        this.libraryItems = libraryItems;
        this.filterLibraryItems();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching library items:', error);
        this.isLoading = false;
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
      this.filterLibraryItems();
    }
  }


  // Filter library items by type
  filterLibraryItems(): void {
    if (this.libraryItems) {
      switch (this.filter) {
        case 'artist':
          this.filteredLibraryItems = this.libraryItems.filter((item) => item.type === 'Artist');
          break;
        case 'album':
          this.filteredLibraryItems = this.libraryItems.filter((item) => item.type === 'Album');
          break;
        case 'playlist':
          this.filteredLibraryItems = this.libraryItems.filter((item) => item.type === 'Playlist');
          break;
        default:
          this.filteredLibraryItems = this.libraryItems;
          break;
      }
    }
  }
}
