import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { retry, Subscription, timer } from 'rxjs';


//* Interface imports
import { Track } from '@/app/interfaces/track';
import { PlaylistResponse } from '@/app/interfaces/playlist-response';


//* Service imports
import { ApiService } from '@/app/services/api.service';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { RoutingService } from '@/app/services/routing.service';


//* Component imports
import { MatMenuModule } from '@angular/material/menu';
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';
import { LibraryItem } from '@/app/interfaces/library-item';
import { LibraryService } from '@/app/services/library.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [
    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgFor,
    NgIf,
    NgClass
  ],
  templateUrl: './playlist-page.component.html',
  styleUrl: './playlist-page.component.css'
})


export class PlaylistPage implements OnInit, OnDestroy {
 // Properties
  playlistId: string = '';
  isLoading: boolean = true;
  error: any = null;
  tracks: any | null | undefined = null;
  displayedColumns: string[] = [
    'index',
    'thumbnail',
    'title',
    'artist',
    'duration',
    'options',
  ];

  private routeParamsSubscription: Subscription = new Subscription;
  private _playlistDetails: PlaylistResponse | null | undefined = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public routingService: RoutingService,
    private apiService: ApiService,
    private libraryService: LibraryService,
    private currentTrackService: CurrentTrackService,
    private cdr: ChangeDetectorRef
  ) {}
  
  @Input()
  set playlistDetails(value: PlaylistResponse | null | undefined) {
    this._playlistDetails = value;
    if (value !== null) {
      this.tracks = value?.tracks?.items?.map((item) => item.track) ?? [];
    } else {
      this.tracks = [];
    }
  }
  

  get playlistDetails(): PlaylistResponse | null | undefined {
    return this._playlistDetails;
  }


  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      if (this.playlistId) {
        this.getPlaylistDetails();
      } else {
        console.error('Missing playlist Id parameter');
      }
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.resetState();
  }

  resetState(): void {
    this.playlistDetails = null;
    this.tracks = null;
    this.isLoading = true;
    this.error = null;
  }

  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  // Function to fetch playlist details
  // Fetch playlist details from API
getPlaylistDetails(): void {
  this.isLoading = true;
  const maxRetries = 5;
  const initialRetryDelay = 500;

  this.apiService
    .fetchPlaylistDetails(this.playlistId)
    .pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => timer(initialRetryDelay * (retryCount + 1))
      })
    )
    .subscribe({
      next: (response) => {
        // Update playlist details and loading state
        this.playlistDetails = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Handle error and update loading state
        console.error('Error fetching playlist details: ', error);
        this.error = error;
        this.isLoading = false;
      },
    });
}

   // Function to format tracks duration as MM:SS
   durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService?.selectTrack(track);
  }

  // Function to toggle favourites
  public toggleFavourite(track: Track) {
    this.apiService.toggleFavourite(track).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error toggling favourite:', error);
      },
    );
  }

  // Function to check if a track is a favourite
  isFavourite(track: Track): boolean {
    return this.apiService.isFavourite(track);
  }

  onSelectItem(id: string, playlistId: string): void {
    this.router.navigate([`/albums/${id}`], { queryParams: { playlistId } });
  }

  artistProfile(id: string): void {
    this.router.navigate([`/artists/${id}`]);
  }

  addLibraryItem(): void {
    if (this.playlistDetails) {
      const libraryItem: LibraryItem = {
        id: this.playlistDetails.id,
        name: this.playlistDetails.name,
        type: 'Playlist',
        owner: this.playlistDetails.owner.display_name,
        owner_id: this.playlistDetails.owner.id,
        image: [
          {
            url: this.playlistDetails.images[0].url,
            width: 0,
            height: 0
          }
        ],
        created_at: this.playlistDetails.tracks.items[0].added_at,
        updated_at: this.playlistDetails.tracks.items[0].added_at
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
}