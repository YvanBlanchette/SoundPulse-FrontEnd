import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { retry, Subject, Subscription, takeUntil, timer } from 'rxjs';


//* Interface imports
import { Track } from '@/app/interfaces/track';
import { PlaylistResponse } from '@/app/interfaces/playlist-response';


//* Service imports
import { ApiService } from '@/app/services/api.service';
import { RoutingService } from '@/app/services/routing.service';
import { LibraryService } from '@/app/services/library.service';
import { CurrentTrackService } from '@/app/services/current-track.service';


//* Component imports
import { PageHeaderComponent } from "@/app/components/_shared/page-header/page-header.component";
import { PageOptionsComponent } from "@/app/components/_shared/page-options/page-options.component";
import { TracksTableComponent } from "@/app/components/_shared/tracks-table/tracks-table.component";
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';


@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    PageOptionsComponent,
    PageHeaderComponent,
    TracksTableComponent
  ],
  templateUrl: './playlist-page.component.html',
  styleUrl: './playlist-page.component.css'
})


export class PlaylistPage implements OnInit, OnDestroy {
  // Playlist data
  playlistId: string = '';
  // Loading state
  isLoading: boolean = true;
  // Error state
  error: string | null = null;
  // Tracks data
  tracks: Track[] = [];


  // Private variables
  private destroy$ = new Subject<void>();
  private routeParamsSubscription: Subscription = new Subscription;
  private _playlistDetails: PlaylistResponse | null | undefined = null;


  // Constructor with dependencie injections
  constructor(
    private route: ActivatedRoute,
    public routingService: RoutingService,
    private apiService: ApiService,
    public libraryService: LibraryService,
    private currentTrackService: CurrentTrackService,
    private cdr: ChangeDetectorRef
  ) { }


  // Setter for the playlist details
  set playlistDetails(value: PlaylistResponse | null | undefined) {
    console.log('playlistDetails: ', value)
    this._playlistDetails = value;
    if (value !== null) {
      this.tracks = (value?.tracks?.items?.map((item) => item.track)) as Track[];
    }
  }


  // Getter for the playlist details
  get playlistDetails(): PlaylistResponse | null | undefined {
    return this._playlistDetails;
  }


  // On Initialize component
  ngOnInit(): void {
    // Subscribe to route params and fetch playlist details
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      if (this.playlistId) {
        this.getPlaylistDetails();
      } else {
        console.error('Missing playlist Id parameter');
      }
    });
  }


  // On Destroy component
  ngOnDestroy(): void {
    // Unsubscribe and reset states
    this.routeParamsSubscription.unsubscribe();
    this.resetState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  // Reset component states
  resetState(): void {
    this.playlistDetails = null;
    this.tracks = [];
    this.isLoading = true;
    this.error = null;
  }


  // Fetch playlist details
  getPlaylistDetails(): void {
    // Set loading state to true
    this.isLoading = true;

    // Maximum permitted retries
    const maxRetries = 5;

    // Initial retry delay
    const initialRetryDelay = 500;

    // Fetch playlist details from my API
    this.apiService
      .fetchPlaylistDetails(this.playlistId)
      .pipe(
        retry({
          count: maxRetries,
          delay: (retryCount) => timer(initialRetryDelay * (retryCount + 1))
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          // Update playlist details
          this.playlistDetails = response;
          // Set loading state to false
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          // Handle error
          console.error('Error fetching playlist details: ', error);
          this.error = error;
          // Set loading state to false
          this.isLoading = false;
        },
      });
  }
}