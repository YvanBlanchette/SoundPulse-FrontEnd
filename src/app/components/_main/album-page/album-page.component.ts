import { retry, Subject, Subscription, takeUntil, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse, AlbumTrack } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

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
import { NgIf } from '@angular/common';


// Define the AlbumPage component
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
  styleUrls: ['./album-page.component.css'],
})
export class AlbumPage implements OnInit, OnDestroy {
  albumId: string = '';
  artistId: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  tracks: Track[] = [];
  otherAlbums: AlbumResponse[] | null | undefined = null;

  // Private variables
  private destroy$ = new Subject<void>();
  private routeParamsSubscription: Subscription = new Subscription;
  private _albumDetails: ExtendedAlbumResponse | null | undefined = null;


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
      console.log(value?.tracks)
      this.tracks = (value?.tracks.items ?? []) as unknown as Track[];
      this.otherAlbums = value?.otherAlbums?.slice(0, 5) ?? [];
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
}