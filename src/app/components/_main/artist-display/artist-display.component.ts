import { MatTableModule } from '@angular/material/table';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Component imports
import { ArtistDetailsStoreService } from '@/app/services/stores/artist-details-store.service';
import { ProgressSpinnerComponent } from "../../_shared/progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-artist-display',
  standalone: true,
  imports: [MatTableModule, ProgressSpinnerComponent],
  templateUrl: './artist-display.component.html',
  styleUrls: ['./artist-display.component.css']
})

export class ArtistDisplayComponent implements OnInit, OnDestroy {
  private _artistDetails: ExtendedArtistResponse | null | undefined = null;
  tracks: any | null | undefined = null;
  albums: AlbumResponse[] | null | undefined = null;
  verified: boolean = true;
  dataSource: Track[] = [];
  isLoading: boolean = false;
  private loadingSubscription: Subscription | null = null;

  constructor(private artistDetailsStoreService: ArtistDetailsStoreService, private currentTrackService: CurrentTrackService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.artistDetailsStoreService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

  @Input()
  set artistDetails(value: ExtendedArtistResponse | null | undefined) {
    this._artistDetails = value;
    if (value !== null) {
      this.tracks = value?.topTracks ?? [];
      this.albums = value?.albums ?? [];
    }
  }

  get artistDetails(): ExtendedArtistResponse | null | undefined {
    return this._artistDetails;
  }

  //! Function to format duration as MM:SS
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  //! Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService.selectTrack(track);
    console.log('Track clicked:', track);
  }
}