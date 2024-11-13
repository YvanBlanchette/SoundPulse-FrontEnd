import { retry, Subscription, timer } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { LibraryItem } from '@/app/interfaces/library-item';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';


//* Service imports
import { ApiService } from '@/app/services/api.service';
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';
import { CurrentTrackService } from '@/app/services/current-track.service';


//* Component imports
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';
import { FavouritesButtonComponent } from "../../_shared/favourites-button/favourites-button.component";


@Component({
  selector: 'app-artist-page',
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
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.css'
})


export class ArtistPage implements OnInit, OnDestroy {
 // Properties
  artistId: string = '';
  isLoading: boolean = true;
  isVerified: boolean = true;
  error: any = null;
  tracks: any | null | undefined = null;
  albums: AlbumResponse[] | null | undefined = null;
  displayedColumns: string[] = [
    'index',
    'thumbnail',
    'title',
    'artist',
    'duration',
    'options',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public routingService: RoutingService,
    private apiService: ApiService,
    private currentTrackService: CurrentTrackService,
    public libraryService: LibraryService,
    private cdr: ChangeDetectorRef
  ) {}
  
  private _artistDetails: ExtendedArtistResponse | null | undefined = null;
  private routeParamsSubscription: Subscription = new Subscription;
  
  @Input()
  set artistDetails(value: ExtendedArtistResponse | null | undefined) {
    this._artistDetails = value;
    if (value !== null) {
      this.tracks = value?.topTracks ?? [];
      this.albums = value?.albums?.slice(0, 5) ?? [];
    }
  }

  get artistDetails(): ExtendedArtistResponse | null | undefined {
    return this._artistDetails;
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.artistId = params['id'];
      if (this.artistId) {
        this.getArtistDetails();
      } else {
        console.error('Missing artist Id parameter');
      }
    });
   
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.resetState();
  }

  resetState(): void {
    this.artistDetails = null;
    this.tracks = null;
    this.albums = null;
    this.isLoading = true;
    this.error = null;
  }

  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  //! Function to fetch artist details
  getArtistDetails(): void {
    this.isLoading = true;
    const maxRetries = 5;
    const initialRetryDelay = 500;
  
    this.apiService
      .fetchArtistDetails(this.artistId)
      .pipe(
        retry({
          count: maxRetries,
          delay: (error, retryCount) => timer(initialRetryDelay * (retryCount + 1))
        })
      )
      .subscribe({
        next: (response) => {
          this.artistDetails = response;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching artist details: ', error);
          this.error = error;
          this.isLoading = false;
        },
      });
  }

   //! Function to format tracks duration as MM:SS
   durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  //! Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService?.selectTrack(track);
  }

  onSelectItem(id: string, artistId: string): void {
    this.router.navigate([`/albums/${id}`], { queryParams: { artistId } });
  }

  artistProfile(id: string): void {
    this.router.navigate([`/artists/${id}`]);
  }

  
  //! Function to add library item
  addLibraryItem(): void {
    if (this.artistDetails) {
      const libraryItem: LibraryItem = {
        id: this.artistDetails.id,
        name: this.artistDetails.name,
        type: 'Artist',
        owner: this.artistDetails.name,
        owner_id: this.artistDetails.id,
        image: [
          {
            url: this.artistDetails.images[0].url,
            width: this.artistDetails.images[0].width,
            height: this.artistDetails.images[0].height
          }
        ],
        created_at: this.artistDetails.created_at,
        updated_at: this.artistDetails.updated_at
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
