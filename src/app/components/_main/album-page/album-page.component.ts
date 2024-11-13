import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, Subscription, Observable, retry, timer, of } from 'rxjs';
import { AsyncPipe,NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, OnDestroy, ChangeDetectorRef, Component, Input } from '@angular/core';

// Interface imports
import { Track } from '@/app/interfaces/track';
import { LibraryItem } from '@/app/interfaces/library-item';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

// Service imports
import { ApiService } from '@/app/services/api.service';
import { RoutingService } from '@/app/services/routing.service';
import { LibraryService } from '@/app/services/library.service';
import { FavouritesService } from '@/app/services/favourites.service';
import { CurrentTrackService } from '@/app/services/current-track.service';

// Component imports
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';
import { FavouritesButtonComponent } from "@/app/components/_shared/favourites-button/favourites-button.component";


// Define the AlbumPage component
@Component({
  selector: 'app-album-page',
  standalone: true,
  imports: [
    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgFor,
    NgIf,
    AsyncPipe,
    FavouritesButtonComponent
],
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css'],
})
export class AlbumPage implements OnInit, OnDestroy {
  // Component properties
  albumId: string = '';
  artistId: string = '';
  isLoading: boolean = true;
  error: any = null;
  tracks: any | null | undefined = null;
  otherAlbums: AlbumResponse[] | null | undefined = null;
  displayedColumns: string[] = [
    'track_number',
    'title',
    'artist',
    'duration',
    'options',
  ];

  // Private album details property
  private _albumDetails: ExtendedAlbumResponse | null | undefined = null;
  private routeParamsSubscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public routingService: RoutingService,
    public favouritesService: FavouritesService,
    private apiService: ApiService,
    public libraryService: LibraryService,
    private currentTrackService: CurrentTrackService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Input property for album details
  @Input()
  // Setter for album details
  set albumDetails(value: ExtendedAlbumResponse | null | undefined) {
    this._albumDetails = value;
    if (value !== null) {
      this.tracks = value?.tracks?.items ?? [];
      this.otherAlbums = value?.otherAlbums ?? [];
    }
  }

  // Getter for album details
  get albumDetails(): ExtendedAlbumResponse | null | undefined {
    return this._albumDetails;
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.albumId = params['id'];
      const artistId = this.route.snapshot.queryParams['artistId'];

      if (this.albumId && artistId) {
        this.artistId = artistId;
        this.getAlbumDetails();
      } else {
        console.error('Missing album ID or artist ID parameters.');
      }
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.resetState();
  }

  resetState(): void {
    this.albumDetails = null;
    this.tracks = null;
    this.otherAlbums = null;
    this.isLoading = true;
    this.error = null;
  }

  // Check if a track is selected
  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  // Fetch album details from API
getAlbumDetails(): void {
  this.isLoading = true;
  const maxRetries = 5;
  const initialRetryDelay = 500;

  this.apiService
    .fetchAlbumDetails(this.albumId, this.artistId)
    .pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => timer(initialRetryDelay * (retryCount + 1))
      })
    )
    .subscribe({
      next: (response) => {
        // Update album details and loading state
        this.albumDetails = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Handle error and update loading state
        console.error('Error fetching album details: ', error);
        this.error = error;
        this.isLoading = false;
      },
    });
}

  // Format track duration as MM:SS
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService?.selectTrack(track);
  }

  // Navigate to artist profile
  artistProfile(id: string): void {
    this.router.navigate([`/artists/${id}`]);
  }

  // Navigate to album page with artist ID as query parameter
  onSelectItem(id: string, artistId: string): void {
    this.router.navigate([`/albums/${id}`], { queryParams: { artistId } });
  }

  addLibraryItem(): void {
    if (this.albumDetails) {
      const libraryItem: LibraryItem = {
        id: this.albumDetails.id,
        name: this.albumDetails.name,
        type: 'Album',
        owner: this.albumDetails.artists[0].name,
        owner_id: this.albumDetails.artists[0].id,
        image: [
          {
            url: this.albumDetails.images[0].url,
            width: this.albumDetails.images[0].width,
            height: this.albumDetails.images[0].height
          }
        ],
        created_at: this.albumDetails.release_date,
        updated_at: this.albumDetails.release_date
      };
  
      this.libraryService.addLibraryItem(libraryItem).subscribe({
        next: (item) => {
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding library item:', error);
          alert(`Failed to add library item: ${error.error.message}`);
        }
      });
    }
  }

   //! Function to remove library item
   removeLibraryItem(id: string): void {
    this.libraryService.removeLibraryItem(id).subscribe({
      next: (libraryItems) => {
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error removing library item:', error);
        alert(`Failed to remove library item: ${error.error.message}`);
      }
    });
  }
}