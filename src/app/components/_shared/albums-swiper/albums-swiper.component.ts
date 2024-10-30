import { Component, CUSTOM_ELEMENTS_SCHEMA, Input  } from '@angular/core';

@Component({
  selector: 'app-albums-swiper',
  standalone: true,
  imports: [],
  templateUrl: './albums-swiper.component.html',
  styleUrl: './albums-swiper.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlbumsSwiperComponent {
  @Input() ArtistAlbums: any | null = null;

  ngOnInit(): void {
    console.log(this.ArtistAlbums);
  }
}
