import { Component, Input } from '@angular/core';
import { PlaylistResponse } from '@/app/interfaces/playlist-response';

@Component({
  selector: 'app-playlist-display',
  standalone: true,
  imports: [],
  templateUrl: './playlist-display.component.html',
  styleUrl: './playlist-display.component.css'
})
export class PlaylistDisplayComponent {
  @Input('fetchedItem') fetchedItem: PlaylistResponse | null = null
}
