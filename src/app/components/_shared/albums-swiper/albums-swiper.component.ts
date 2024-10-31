import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild } from '@angular/core';

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
  @ViewChild('swiperContainer') swiperContainer: AlbumsSwiperComponent | null = null;
}