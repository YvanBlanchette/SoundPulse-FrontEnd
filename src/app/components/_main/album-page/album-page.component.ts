import { combineLatest, Observable } from 'rxjs';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, ChangeDetectorRef, Component, Input } from '@angular/core';

// Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

// Service imports
import { ApiService } from '@/app/services/api.service';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { RoutingService } from '@/app/services/routing.service';

// Component imports
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';


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
    NgClass
  ],
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css'],
})
export class AlbumPage implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public routingService: RoutingService,
    private apiService: ApiService,
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
    // Combine route parameters and query parameters
    combineLatest([this.route.paramMap, this.route.queryParams]).subscribe(
      ([params, queryParams]) => {
        // Extract album ID and artist ID from route parameters
        this.albumId = params.get('id') || '';
        this.artistId = queryParams['artistId'] || '';

        // Fetch album details if both IDs are present
        if (this.albumId && this.artistId) {
          this.getAlbumDetails();
        } else {
          console.error('Missing album ID or artist ID parameters.');
        }
      },
    );
  }

  // Check if a track is selected
  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  // Fetch album details from API
  getAlbumDetails(): void {
    this.apiService
      .fetchAlbumDetails(this.albumId, this.artistId)
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

  // Toggle favourite
  public toggleFavourite(track: Track) {
    this.apiService.toggleFavourite(track).subscribe(
      (response) => {
        console.log('Favourite toggled:', response);
      },
      (error) => {
        console.error('Error toggling favourite:', error);
      },
    );
  }

  // Check if a track is a favourite
  isFavourite(track: Track): boolean {
    return this.apiService.isFavourite(track);
  }
}