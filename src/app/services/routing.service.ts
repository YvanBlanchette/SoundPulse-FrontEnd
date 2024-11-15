import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError, } from 'rxjs';

//* Service imports
import { Router } from '@angular/router';

export enum Categories  {
  artist = 'artists',
  Artist = 'artists',
  album = 'albums',
  Album = 'albums',
  playlist = 'playlists',
  Playlist = 'playlists',
  track = 'tracks'
}

@Injectable({ providedIn: 'root' })
export class RoutingService {
  public Categories = Categories;

  constructor(private router: Router) { }
  
  // Function to get search results
  navigateTo(category: Categories, id: string): Observable<any> {
    try {
      this.router.navigate([`/${category}/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }

  // Function to get search results
  navigateByUrl(route:string): Observable<any> {
    try {
      this.router.navigate([`/${route}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }
  
  navigateToArtist(id: string): Observable<any> {
    try {
      this.router.navigate([`/artists/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }

  navigateToAlbum(id: string, artistId: string): Observable<any> {
    try {
      this.router.navigate([`/albums/${id}`], {
        queryParams: { artistId },
      });
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }

  navigateToPlaylist(id: string): Observable<any> {
    try {
      this.router.navigate([`/playlists/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }

  navigateToTrack(id: string): Observable<any> {
    try {
      this.router.navigate([`/tracks/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }
}
