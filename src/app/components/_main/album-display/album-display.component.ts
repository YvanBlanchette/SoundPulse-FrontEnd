import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

//* Interface imports
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';
import { Track } from '@/app/interfaces/track';

//* Component imports
import { AlbumsSwiperComponent } from "@/app/components/_shared/albums-swiper/albums-swiper.component";


@Component({
  selector: 'app-album-display',
  standalone: true,
  imports: [MatTableModule, AlbumsSwiperComponent],
  templateUrl: './album-display.component.html',
  styleUrls: ['./album-display.component.css']
})
  
export class AlbumDisplayComponent {
  private _albumDetails: ExtendedAlbumResponse | null | undefined = null;
  tracks: any | null | undefined = null;
  otherAlbums: AlbumResponse[] | null | undefined = null;
  displayedColumns: string[] = ['track_number', 'title', 'duration', 'options'];

  constructor() { }

  @Input()
  set albumDetails(value: ExtendedAlbumResponse | null | undefined) {
    this._albumDetails = value;
    if (value !== null) {
      this.tracks = value?.tracks?.items ?? [];
      this.otherAlbums = value?.otherAlbums ?? [];
    }
  }

  get albumDetails(): ExtendedAlbumResponse | null | undefined {
    return this._albumDetails;
  }

    // Methods
    durationFormatter(durationMs: number): string {
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}
