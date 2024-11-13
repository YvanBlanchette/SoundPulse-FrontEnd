//* Module imports
import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Component imports
import { LibraryItemComponent } from '@/app/components/_sidebar/library-item/library-item.component';

//* Service imports
import { LibraryService } from '@/app/services/library.service';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryItemComponent, MatIconModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LibraryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filter: string = 'all';
  libraryItems: LibraryItem[] | null = null;
  selectedItem: LibraryItem | null = null;
  favouriteSongs: LibraryItem[] | null = null;
  isLoading = true;
  errorMessage = '';
  filteredLibraryItems: LibraryItem[] | null = null;

  constructor(private libraryService: LibraryService, private cdr: ChangeDetectorRef) { 
    console.log('LibraryComponent: Constructor');
  }

  private ngUnsubscribe = new Subject();

  ngOnInit(): void {
    console.log('LibraryComponent: Initial filter is', this.filter);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter']) {
      console.log('Filter changed to', this.filter);
      this.filterLibraryItems();
    }
  }

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
