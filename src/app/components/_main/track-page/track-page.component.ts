import { ApiService } from '@/app/services/api.service';
import { RoutingService } from '@/app/services/routing.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerComponent } from "../../_shared/progress-spinner/progress-spinner.component";
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Track } from '@/app/interfaces/track';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { FavouritesButtonComponent } from "../../_shared/favourites-button/favourites-button.component";
import { FavouritesService } from '@/app/services/favourites.service';

@Component({
  selector: 'app-track-page',
  standalone: true,
  imports: [
    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgFor,
    NgIf,
    FavouritesButtonComponent,
    AsyncPipe
],
  templateUrl: './track-page.component.html',
  styleUrl: './track-page.component.css'
})
export class TrackPage {
  isLoading: boolean = true;
  trackDetails: any;
  trackId: string | null = null;
  recommendedTracks: any[] = [];
  error: string | null = null;
  displayedColumns: string[] = [
    'index',
    'thumbnail',
    'title',
    'artist',
    'duration',
    'options',
  ];

  constructor(
    private currentTrackService: CurrentTrackService,
    public routingService: RoutingService,
    public favouritesService: FavouritesService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.trackId = params['id'];
      if (this.trackId) {
        this.getTrackDetails(this.trackId);
      } else {
        console.error('Missing track Id parameter');
      }
    });
  }

  //! Function to get track details
  getTrackDetails(trackId: string): void {
    this.apiService
      .fetchTrackDetails(trackId)
      .subscribe({
        next: (response) => {
          this.trackDetails = response;
          this.recommendedTracks = response.recommendations;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching track details:', error);
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

  //! Function to handle album click
  onSelectItem(id: string, artistId: string): void {
    this.router.navigate([`/albums/${id}`], { queryParams: { artistId } });
  }

  //! Function to navigate to album page
  onAlbumClick(item: any): void {
    const artistId = item.artists[0].id;
    this.router.navigate(['/albums', item.id], { queryParams: { artistId } });
}
}