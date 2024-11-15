import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

//* Service imports
import { LocalStorageCacheService } from './local-storage-cache.service';

//* Interface imports
import { Track } from '@/app/interfaces/track';


@Injectable({
  providedIn: 'root'
})


export class CurrentTrackService {
  // Volume Subject and Observable
  private volumeSubject = new BehaviorSubject<number>(0.5);
  volume$: Observable<number> = this.volumeSubject.asObservable();


  // Current track Subject and Observable
  private trackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$: Observable<Track | null> = this.trackSubject.asObservable();


  // Loading Subject and Observable
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();


  // Cache key
  private cacheKey = 'current-track';


  // Constructor with dependencie injection
  constructor(private cacheService: LocalStorageCacheService) {
    this.initCurrentTrack();
  }


  // Function to initialize the current track
  private initCurrentTrack(): void {
    const cachedTrack = this.cacheService.getItem(this.cacheKey) as Track;
    if (cachedTrack) {
      this.trackSubject.next(cachedTrack);
    }
  }


  // Function to check if a track is selected
  isSelected(track: Track): boolean {
    return this.trackSubject.getValue()?.id === track.id
  }


  // Function to select a track
  selectTrack(track: Track): void {
    // Update the current track
    this.trackSubject.next(track);
    // Update the cache
    this.cacheService.setItem(this.cacheKey, track);
  }


  // Function to clear the current track
  clearTrack(): void {
    // Update the current track
    this.trackSubject.next(null);
    // Update the cache
    this.cacheService.removeItem(this.cacheKey);
  }


  // Function to load the current track
  loadCurrentTrack(): void {
    // Set loading to true
    this.loadingSubject.next(true);
    // Check if the track is cached
    const cachedTrack = this.cacheService.getItem(this.cacheKey) as Track;
    if (cachedTrack) {
      // Update the current track
      this.trackSubject.next(cachedTrack);
      // Set loading to false
      this.loadingSubject.next(false);
    }
  }


  // Function to set the volume
  setVolume(volume: number): void {
    // Update the volume level
    this.volumeSubject.next(volume);
  }
}