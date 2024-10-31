import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

//* Component imports
import { LogoComponent } from "@/app/components/_shared/logo/logo.component";

//* Service imports
import { ApiService } from '@/app/services/api-service.service';

//* Interface imports
import { NewAlbums } from '@/app/interfaces/new-albums';
import { AlbumResponse } from '@/app/interfaces/album-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
})
export class WelcomePageComponent implements AfterViewInit, OnDestroy {
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