import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

//* Interface imports
import { Track } from '../interfaces/track';

@Injectable({
  providedIn: 'root'
})

export class FavouritesService {
  // Cache key
  private storageKey = 'favouriteTracks';
  // Favourite track Subject
  private favouriteTracks$ = new BehaviorSubject<Track[]>(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));


  // Function to add a track to favourites
  addFavourite(track: Track): void {
    // Get the current favourite tracks
    const favouriteTracks = this.favouriteTracks$.getValue();
    // Check if the track is already a favourite
    if (!favouriteTracks.some((favouriteTrack) => favouriteTrack.id === track.id)) {
      // Add the track to the favourites
      favouriteTracks.push(track);
      // Update the local storage
      localStorage.setItem(this.storageKey, JSON.stringify(favouriteTracks));
      // Update the favourite tracks subject
      this.favouriteTracks$.next(favouriteTracks);
    }
  }


  // Function to remove a track from favourites
  removeFavourite(track: Track): void {
    // Get the current favourite tracks
    const favouriteTracks = this.favouriteTracks$.getValue();
    // Remove the track from the favourites
    const updatedTracks = favouriteTracks.filter((favouriteTrack) => favouriteTrack.id !== track.id);
    // Update the local storage cache
    localStorage.setItem(this.storageKey, JSON.stringify(updatedTracks));
    // Update the favourite tracks subject
    this.favouriteTracks$.next(updatedTracks);
  }


  // Function to get the list of favourite tracks
  getFavouriteTracks(): Observable<Track[]> {
    return this.favouriteTracks$.asObservable();
  }


  // Function to check if a track is a favourite
  isFavourite(track: Track): Observable<boolean> {
    return this.favouriteTracks$.pipe(
      map((favouriteTracks) => favouriteTracks.some((favouriteTrack) => favouriteTrack.id === track.id))
    );
  }
}