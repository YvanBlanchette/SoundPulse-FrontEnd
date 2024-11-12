//* Module imports
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Component imports
import { LibraryItemComponent } from '@/app/components/_sidebar/library-item/library-item.component';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { LibraryService } from '@/app/services/library.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryItemComponent, MatIconModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LibraryComponent implements OnInit, OnDestroy {
  libraryItems: LibraryItem[] | null = null;
  selectedItem: LibraryItem | null = null;
  favouriteSongs: LibraryItem[] | null = null;
  loading = true;
  errorMessage = '';

  private librarySubscription: Subscription = new Subscription;

  constructor(private libraryService: LibraryService) { }

    ngOnInit(): void {
      this.librarySubscription = this.libraryService.library$.subscribe({
        next: (libraryItems) => {
        if (!libraryItems) {
          this.loading = false;
          return;
        }
  
        // Set the library items
        this.libraryItems = libraryItems.filter(item => item.type !== 'Favorites');
  
        // Filter the favourite songs playlist
        this.favouriteSongs = libraryItems.filter(item => item.type === 'Favorites');
  
        // Set the loading state to false
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching library items:', error.message, error);
        this.errorMessage = 'Désolé, une erreur s\'est produite.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.librarySubscription.unsubscribe();
  }
}
