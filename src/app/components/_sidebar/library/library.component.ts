//* Module imports
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Component imports
import { LibraryItemComponent } from '@/app/components/_sidebar/library-item/library-item.component';

//* Service imports
import { ApiService } from '@/app/services/api.service';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryItemComponent, MatIconModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryItems: LibraryItem[] | null = null;
  selectedItem: LibraryItem | null = null;
  favouriteSongs: LibraryItem[] | null = null;
  loading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) { }

  // Lifecycle hooks
  ngOnInit(): void {
    this.apiService.getFormattedLibraryItems().subscribe({
      next: (libraryItems) => {
        // Set the library items
        const result = libraryItems;

        // Set the library items
        this.libraryItems = result.filter(item => item.type !== 'Favorites');

        // Filter the favourite songs playlist
        this.favouriteSongs = result.filter(item => item.type === 'Favorites');

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
}
