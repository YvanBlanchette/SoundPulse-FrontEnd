import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError, } from 'rxjs';

//* Service imports
import { Router } from '@angular/router';

//* Enum for categories
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


  // Constructor with dependencie injection
  constructor(private router: Router) { }


  // Function to navigate by category
  navigateTo(category: Categories, id: string): Observable<any> {
    try {
      // Navigate to the specified category
      this.router.navigate([`/${category}/${id}`]);
      return EMPTY;
    } catch (error) {
      // Handle the error
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }

  
  // Function to navigate by Url
  navigateByUrl(route:string): Observable<any> {
    try {
      // Navigate to the specified  Url
      this.router.navigate([`/${route}`]);
      return EMPTY;
    } catch (error) {

      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }


  // Function to navigate to artist
  navigateToArtist(id: string): Observable<any> {
    try {
      this.router.navigate([`/artists/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }


  // Function to navigate to album
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


  // Function to navigate to playlist
  navigateToPlaylist(id: string): Observable<any> {
    try {
      this.router.navigate([`/playlists/${id}`]);
      return EMPTY;
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      return throwError(error);
    }
  }


  // Function to navigate to track
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