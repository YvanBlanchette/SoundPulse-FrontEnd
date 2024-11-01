import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Component imports
import { LibraryItem } from '@/app/interfaces/library-item';
import { AlbumLibraryItem } from '@/app/interfaces/album-library-items';
import { SelectedLibraryItemService } from '@/app/services/selected-library-item.service';
import { ArtistDetailsStoreService } from '@/app/services/stores/artist-details-store.service';
import { ProgressSpinnerComponent } from "../../_shared/progress-spinner/progress-spinner.component";
import { ApiService } from '@/app/services/api-service.service';

@Component({
  selector: 'app-artist-display',
  standalone: true,
  imports: [MatTableModule, ProgressSpinnerComponent, MatMenuModule, NgClass],
  templateUrl: './artist-display.component.html',
  styleUrls: ['./artist-display.component.css']
})

export class ArtistDisplayComponent implements OnInit, OnDestroy {
  private _artistDetails: ExtendedArtistResponse | null | undefined = null;
  album?: AlbumLibraryItem;

  tracks: any | null | undefined = null;

  albums: AlbumResponse[] | null | undefined = null;

  dataSource: Track[] = [];
  
  isVerified: boolean = true;

  isLoading: boolean = false;

  private loadingSubscription: Subscription | null = null;

  constructor(private artistDetailsStoreService: ArtistDetailsStoreService, private currentTrackService: CurrentTrackService, private selectedLibraryItemService: SelectedLibraryItemService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.artistDetailsStoreService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

  @Output() libraryItemSelected: EventEmitter<AlbumLibraryItem | undefined> = new EventEmitter();

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
  }

  //! Function to handle album click
  onSelect(): void {
    if (this.album) {
      this.libraryItemSelected.emit(this.album);
      this.selectedLibraryItemService.setSelectedItem(this.album);
      console.log(this.album);
    }
  }

  //! Function to toggle favourite
  public toggleFavourite(track: Track) {
    this.apiService.toggleFavourite(track).subscribe((response) => {
      console.log('Favourite toggled:', response);
    }, (error) => {
      console.error('Error toggling favourite:', error);
    });
  }

  //! Function to check if a track is a favorite
  isFavourite(track: Track): boolean {
    return this.apiService.isFavourite(track);
  }
}