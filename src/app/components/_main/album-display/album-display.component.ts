import { Component, Input } from '@angular/core';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';
import { Track } from '@/app/interfaces/track';

@Component({
  selector: 'app-album-display',
  standalone: true,
  imports: [],
  templateUrl: './album-display.component.html',
  styleUrl: './album-display.component.css'
})
export class AlbumDisplayComponent {
  @Input() albumDetails: ExtendedAlbumResponse | null | undefined = null;
  tracks: any | null | undefined = null;
  albums: AlbumResponse[] | null | undefined = null;
  verified: boolean = true;
  dataSource: Track[] = [];
}
