import { retry, Subject, Subscription, takeUntil, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';

//* Component imports
import { CollectionComponent } from "@/app/components/_shared/collection/collection.component";
import { PageHeaderComponent } from "@/app/components/_shared/page-header/page-header.component";
import { TracksTableComponent } from "@/app/components/_shared/tracks-table/tracks-table.component";
import { PageOptionsComponent } from "@/app/components/_shared/page-options/page-options.component";
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';


@Component({
  selector: 'app-artist-page',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    TracksTableComponent,
    CollectionComponent,
    PageHeaderComponent,
    PageOptionsComponent
],
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.css'
})


export class ArtistPage implements OnInit, OnDestroy {
  // Artist data
  artistId: string = '';
  // Loading state
  isLoading: boolean = true;
  // Error state
  error: string | null = null;
  // Tracks data
  tracks: Track[] = [];
  // Albums data
  albums: AlbumResponse[] | null | undefined = null;

  // Private variables
  private destroy$ = new Subject<void>();
  private routeParamsSubscription: Subscription = new Subscription;
  private _artistDetails: ExtendedArtistResponse | null | undefined = null;

  // Constructor with dependencie injections
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    public routingService: RoutingService,
    public libraryService: LibraryService,
  ) {}

  // Setter for the artist details
  set artistDetails(value: ExtendedArtistResponse | null | undefined) {
    this._artistDetails = value;
    if (value !== null) {
      this.tracks = (value?.topTracks ?? []) as Track[];
      this.albums = value?.albums?.slice(0, 5) ?? [];
    }
  }

  // Getter for the artist details
  get artistDetails(): ExtendedArtistResponse | null | undefined {
    return this._artistDetails;
  }

  // On Initialize component
  ngOnInit(): void {
    // Subscribe to route params and fetch artist details
    this.routeParamsSubscription = this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.artistId = params['id'];
      if (this.artistId) {
        this.getArtistDetails();
      } else {
        console.error('Missing artist Id parameter');
        this.error = 'Id de l\'artiste est manquant';
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
    this.artistDetails = null;
    this.tracks = [];
    this.albums = null;
    this.isLoading = true;
    this.error = null;
  }

  // Fetch artist details
  getArtistDetails(): void {
    // Set loading state to true
    this.isLoading = true;

    // Maximum permitted retries
    const maxRetries = 5;

    // Delay between retries
    const initialRetryDelay = 500;

    // Fetch artist details from my API
    this.apiService
      .fetchArtistDetails(this.artistId)
      .pipe(
        retry({
          count: maxRetries,
          delay: (retryCount) => timer(initialRetryDelay * (retryCount + 1))
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          // Update artist details
          this.artistDetails = response;
          // Set loading state to false
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          // Handle error
          console.error('Error fetching artist details:', error);
          this.error = error.message;
          this.isLoading = false;
        },
      });
  }
}