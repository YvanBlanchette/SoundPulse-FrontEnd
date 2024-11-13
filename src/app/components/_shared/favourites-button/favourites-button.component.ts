import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FavouritesService } from '@/app/services/favourites.service';
import { Track } from '@/app/interfaces/track';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-favourites-button',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './favourites-button.component.html',
})
export class FavouritesButtonComponent implements OnInit {
  @Input() track?: Track;
  isFavourite$: Observable<boolean> = new Observable<boolean>();

  constructor(private favouritesService: FavouritesService) { }

  ngOnInit(): void {
    if (this.track) {
      this.isFavourite$ = this.favouritesService.isFavourite(this.track);
      this.isFavourite$.subscribe({
        next: (isFavourite) => {
          // console.log('Is favourite:', isFavourite);
        },
        error: (error) => {
          console.error('Error checking if track is favourite:', error);
        }
      });
    }
  }

  //! Function to add a song to the favourites
addFavourite(): void {
  if (this.track) {
    this.favouritesService.addFavourite(this.track);
  }
}

//! Function to remove a song from the favourites
removeFavourite(): void {
  if (this.track) {
    this.favouritesService.removeFavourite(this.track);
  }
}


  isFavourite(track: Track): void {
   if (this.track) {
    this.favouritesService.isFavourite(this.track).subscribe({
      next: (isFavourite) => {
        // console.log('Is favourite:', isFavourite);
      },
      error: (error) => {
        console.error('Error checking if track is favourite:', error);
      }
    });
   } 
  }
}