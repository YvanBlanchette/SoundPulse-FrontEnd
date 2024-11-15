import { retry, Subject, Subscription, takeUntil, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

//* Component imports
import { CollectionComponent } from "@/app/components/_shared/collection/collection.component";
import { PageHeaderComponent } from "@/app/components/_shared/page-header/page-header.component";
import { TracksTableComponent } from "@/app/components/_shared/tracks-table/tracks-table.component";
import { PageOptionsComponent } from "@/app/components/_shared/page-options/page-options.component";
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse, AlbumTrack } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';


@Component({
  selector: 'app-album-page',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    PageOptionsComponent,
    PageHeaderComponent,
    TracksTableComponent,
    CollectionComponent,
  ],
  templateUrl: './album-page.component.html',
})


export class AlbumPage implements OnInit, OnDestroy {
  // Album Id
  albumId: string = '';
  // Artist Id
  artistId: string = '';
  // Loading state
  isLoading: boolean = true;
  // Error state
  error: string | null = null;
  // Tracks data
  tracks: Track[] = [];
  // Other albums data
  otherAlbums: AlbumResponse[] | null | undefined = null;


  // Private variables
  private destroy$ = new Subject<void>();
  private routeParamsSubscription: Subscription = new Subscription;
  private _albumDetails: ExtendedAlbumResponse | null | undefined = null;


  // Constructor with dependencie injections
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    public routingService: RoutingService,
    public libraryService: LibraryService,
  ) { }


  // Setter for album details
  set albumDetails(value: ExtendedAlbumResponse | null | undefined) {
    this._albumDetails = value;
    if (value !== null) {
      this.tracks = (value?.tracks.items ?? []) as unknown as Track[];
      this.otherAlbums = value?.otherAlbums?.slice(0, 5) ?? [];
    }
  }


  // Getter for album details
  get albumDetails(): ExtendedAlbumResponse | null | undefined {
    return this._albumDetails;
  }


  // On Initialize component
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
    this.albumDetails = null;
    this.tracks = [];
    this.otherAlbums = null;
    this.isLoading = true;
    this.error = null;
  }


  // Fetch album details from API
  getAlbumDetails(): void {
    // Set loading state to true
    this.isLoading = true;

    // Maximum permitted retries
    const maxRetries = 5;

    // Delay between retries
    const initialRetryDelay = 500;

    // Fetch album details from my API
    this.apiService
      .fetchAlbumDetails(this.albumId, this.artistId)
      .pipe(
        retry({
          count: maxRetries,
          delay: (error, retryCount) => timer(initialRetryDelay * (retryCount + 1))
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          // Update album details
          this.albumDetails = response;
          // Set loading state to false
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          // Handle error
          console.error('Error fetching album details: ', error);
          this.error = error;
          // Set loading state to false
          this.isLoading = false;
        },
      });
  }
}