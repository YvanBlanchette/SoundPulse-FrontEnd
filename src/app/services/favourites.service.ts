import { Injectable } from '@angular/core';
import { Track } from '../interfaces/track';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private storageKey = 'favouriteTracks';
  private favouriteTracks$ = new BehaviorSubject<Track[]>(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));

  addFavourite(track: Track): void {
    const favouriteTracks = this.favouriteTracks$.getValue();
    if (!favouriteTracks.some((favouriteTrack) => favouriteTrack.id === track.id)) {
      favouriteTracks.push(track);
      localStorage.setItem(this.storageKey, JSON.stringify(favouriteTracks));
      this.favouriteTracks$.next(favouriteTracks);
    }
  }
  
  removeFavourite(track: Track): void {
    const favouriteTracks = this.favouriteTracks$.getValue();
    const updatedTracks = favouriteTracks.filter((favouriteTrack) => favouriteTrack.id !== track.id);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedTracks));
    this.favouriteTracks$.next(updatedTracks);
  }

  getFavouriteTracks(): Observable<Track[]> {
    return this.favouriteTracks$.asObservable();
  }

  isFavourite(track: Track): Observable<boolean> {
    return this.favouriteTracks$.pipe(
      map((favouriteTracks) => favouriteTracks.some((favouriteTrack) => favouriteTrack.id === track.id))
    );
  }
}