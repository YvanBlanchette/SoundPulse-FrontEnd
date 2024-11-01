import { Component, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryItem } from '@/app/interfaces/library-item';

// Component imports
import { ArtistDisplayComponent } from "@/app/components/_main/artist-display/artist-display.component";
import { AlbumDisplayComponent } from "@/app/components/_main/album-display/album-display.component";
import { PlaylistDisplayComponent } from "@/app/components/_main/playlist-display/playlist-display.component";

// Service imports
import { ApiService } from '@/app/services/api-service.service';
import { SelectedLibraryItemService } from '@/app/services/selected-library-item.service';
import { LocalStorageCacheService } from '@/app/services/local-storage-cache.service';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';
import { WelcomePageComponent } from "../_main/welcome-page/welcome-page.component";
import { ProgressSpinnerComponent } from "../_shared/progress-spinner/progress-spinner.component";
import { PlaylistResponse } from '@/app/interfaces/playlist-response';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ArtistDisplayComponent, AlbumDisplayComponent, PlaylistDisplayComponent, WelcomePageComponent, ProgressSpinnerComponent],
  templateUrl: './main.component.html',
})
export class MainComponent implements AfterViewInit, OnDestroy {
   // Artist details
  artistDetails: ExtendedArtistResponse | null = null;
  
  // Album details
  albumDetails: ExtendedAlbumResponse | null = null;

  // Album details
  playlistDetails: PlaylistResponse | null = null;
  
  // Subscription for API calls
  subscription: Subscription | null = null;
  
  // Currently selected library item
  selectedItem!: { type: string } | null | undefined;

  constructor(
    public selectedLibraryItemService: SelectedLibraryItemService,
    private localStorageCacheService: LocalStorageCacheService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
  ) { }

  // Lifecycle hook: AfterViewInit
  ngAfterViewInit(): void {
    this.selectedLibraryItemService.selectedItem$.subscribe((item) => {
      this.selectedItem = item;
  
      // Check if item is selected
      if (item) {
        //! Load artist details
        if (item.type === 'Artiste') {
          // Use cache service to fetch or retrieve artist details
          this.subscription = this.localStorageCacheService.getOrFetchItem(
            `artist-${item.id}`,
            () => this.apiService.getArtistDetails(item.id ?? '')
          ).subscribe((artist) => {
            // Update artist and item details
            this.artistDetails = artist;
              this.cdr.detectChanges(); 
          });
        } 
        //! Load album details
        else if (item.type === 'Album') {
          // Use cache service to fetch or retrieve album details
          this.subscription = this.localStorageCacheService.getOrFetchItem(
            `album-${item.id}`,
            () => this.apiService.getAlbumDetails(item.id ?? '', item.owner_id ?? '')
          ).subscribe((album) => {
            // Update album and item details
            this.albumDetails = album;
              this.cdr.detectChanges(); 
          });
        }
        //! Load playlist details
        else if (item.type === 'Liste de lecture') {
          // Use cache service to fetch or retrieve playlist details
          this.subscription = this.localStorageCacheService.getOrFetchItem(
            `playlist-${item.id}`,
            () => this.apiService.getPlaylistDetails(item.id ?? '')
          ).subscribe((playlist) => {
            console.log(playlist);
            // Update playlist and item details
            this.playlistDetails = playlist;
              this.cdr.detectChanges(); 
          });
        }
      }
    });
  }

  // Lifecycle hook: OnDestroy
  ngOnDestroy(): void {
    // Unsubscribe from subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}