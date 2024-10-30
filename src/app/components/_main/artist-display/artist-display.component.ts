import { MatTableModule } from '@angular/material/table';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';

//* Component imports
import { AlbumsSwiperComponent } from "@/app/components/_shared/albums-swiper/albums-swiper.component";


@Component({
  selector: 'app-artist-display',
  standalone: true,
  imports: [MatTableModule, AlbumsSwiperComponent],
  templateUrl: './artist-display.component.html',
  styleUrls: ['./artist-display.component.css']
})

export class ArtistDisplayComponent {
  private _artistDetails: ExtendedArtistResponse | null | undefined = null;
  tracks: any | null | undefined = null;
  albums: AlbumResponse[] | null | undefined = null;
  verified: boolean = true;
  dataSource: Track[] = [];

  constructor() { }

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

  // Methods
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}