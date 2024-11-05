import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError, } from 'rxjs';

//* Service imports
import { Router } from '@angular/router';

export enum Categories  {
  artist = 'artists',
  album = 'albums',
  playlist = 'playlists',
  track = 'tracks'
}

@Injectable({ providedIn: 'root' })
export class RoutingService {
  public Categories = Categories;

  constructor(private router: Router) { }
  
  //! Function to get search results
  navigateTo(category: Categories, id: string): Observable<any> {
    try {
      this.router.navigate([`/${category}/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }
}
