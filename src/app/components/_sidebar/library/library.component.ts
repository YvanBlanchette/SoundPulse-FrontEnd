//* Module imports
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Component imports
import { LibraryItemComponent } from '@/app/components/_sidebar/library-item/library-item.component';

//* Service imports
import { ApiService } from '@/app/services/api-service.service';
import { ArtistDetailsStoreService } from '@/app/services/stores/artist-details-store.service';
import { AlbumDetailsStoreService } from '@/app/services/stores/album-details-store.service';

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
  loading = true;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private artistDetailsStoreService: ArtistDetailsStoreService,
    private albumDetailsStoreService: AlbumDetailsStoreService,
  ) { }

  // Lifecycle hooks
  ngOnInit(): void {
    this.apiService.getFormattedLibraryItems().subscribe({
      next: (libraryItems) => {
        this.libraryItems = libraryItems;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching library items:', error.message, error);
        this.errorMessage = 'Désolé, une erreur s\'est produite.';
        this.loading = false;
      }
    });
  }

  onItemSelected(item: LibraryItem) {
    this.selectedItem = item;
    if (item.type === 'Artiste') {
      this.artistDetailsStoreService.loadArtistDetails(item.id);
    }
    else if (item.type === 'Album') {
      const artistId = item.owner_id as string;
      this.albumDetailsStoreService.loadAlbumDetails(item.id, artistId);
    }
  }
}
