import { Component, OnDestroy, AfterViewInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LogoComponent } from "../../_shared/logo/logo.component";
import { ApiService } from '@/app/services/api-service.service';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';
import { Subscription } from 'rxjs';
import { NewAlbums } from '@/app/interfaces/new-albums';
import { AlbumsSwiperComponent } from "../../_shared/albums-swiper/albums-swiper.component";

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [LogoComponent, AlbumsSwiperComponent],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('swiperContainer') swiperContainer: AlbumsSwiperComponent | null = null;
  newAlbums: AlbumResponse[] | null = null;
  subscription: Subscription | null = null;

  constructor(
    private apiService: ApiService,
  ) { }

  ngAfterViewInit(): void {
    this.subscription = this.apiService.getNewAlbums().subscribe((response: NewAlbums) => {
      this.newAlbums = response.albums.items;
    }, 
    (error) => {
      console.error('Error fetching new albums:', error);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}