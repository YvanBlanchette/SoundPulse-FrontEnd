import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

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


export class PlaylistPage implements OnInit {
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public routingService: RoutingService,
    private apiService: ApiService,
    private currentTrackService: CurrentTrackService,
    private cdr: ChangeDetectorRef
  ) {}
  
  private _playlistDetails: PlaylistResponse | null | undefined = null;

  
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
    this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      console.log('Playlist ID:', this.playlistId);
      if (this.playlistId) {
        this.getPlaylistDetails();
      } else {
        console.error('Missing playlist Id parameter');
      }
    });
  }


  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  // Function to fetch playlist details
  getPlaylistDetails(): void {
    this.apiService
      .fetchPlaylistDetails(this.playlistId)
      .subscribe({
        next: (response) => {
          this.playlistDetails = response;
          console.log('Playlist details: ', response);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
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

  onSelectItem(id: string, playlistId: string): void {
        this.router.navigate([`/albums/${id}`], { queryParams: { playlistId } });
  }

  artistProfile(id: string): void {
        this.router.navigate([`/artists/${id}`]);
  }
}
