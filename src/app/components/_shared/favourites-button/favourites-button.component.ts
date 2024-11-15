import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FavouritesService } from '@/app/services/favourites.service';
import { Track } from '@/app/interfaces/track';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-favourites-button',
  standalone: true,
  imports: [AsyncPipe, MatTooltipModule],
  templateUrl: './favourites-button.component.html',
})


export class FavouritesButtonComponent implements OnInit {
  @Input() track?: Track;

  isFavourite$: Observable<boolean> = new Observable<boolean>();

  // Constructor with dependency injection
  constructor(private favouritesService: FavouritesService) { }

  // On Initialize component
  ngOnInit(): void {
    if (this.track) {
      this.isFavourite$ = this.favouritesService.isFavourite(this.track);
    }
  }

  // Function to add a song to the favourites
  addFavourite(): void {
    if (this.track) {
      this.favouritesService.addFavourite(this.track);
    }
  }

  // Function to remove a song from the favourites
  removeFavourite(): void {
    if (this.track) {
      this.favouritesService.removeFavourite(this.track);
    }
  }
}