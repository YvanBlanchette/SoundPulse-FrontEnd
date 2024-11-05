import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ArtistResponse } from '@/app/interfaces/artist-response';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';


//* Service imports
import { ApiService } from '@/app/services/api.service';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { RoutingService } from '@/app/services/routing.service';


//* Component imports
import { MatMenuModule } from '@angular/material/menu';
import { ProgressSpinnerComponent } from '../../_shared/progress-spinner/progress-spinner.component';


@Component({
  selector: 'app-artist-page',
  standalone: true,
  imports: [
    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgFor,
    NgIf,
    NgClass
  ],
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.css'
})


export class ArtistPage implements OnInit {
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
    private cdr: ChangeDetectorRef
  ) {}
  
  private _artistDetails: ExtendedArtistResponse | null | undefined = null;

  
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
    this.route.params.subscribe(params => {
      this.artistId = params['id'];
      console.log('Artist ID:', this.artistId);
      if (this.artistId) {
        this.getArtistDetails();
      } else {
        console.error('Missing artist Id parameter');
      }
    });
  }


  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  // Function to fetch artist details
  getArtistDetails(): void {
    this.apiService
      .fetchArtistDetails(this.artistId)
      .subscribe({
        next: (response) => {
          this.artistDetails = response;
          console.log('Artist details: ', response);
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
        console.log('Favourite toggled:', response);
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

  onSelectItem(id: string, artistId: string): void {
        this.router.navigate([`/albums/${id}`], { queryParams: { artistId } });
  }

  artistProfile(id: string): void {
        this.router.navigate([`/artists/${id}`]);
  }
}
