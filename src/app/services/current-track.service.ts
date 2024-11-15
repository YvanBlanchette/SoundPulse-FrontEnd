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
  // Volume
  private volumeSubject = new BehaviorSubject<number>(0.5);
  volume$: Observable<number> = this.volumeSubject.asObservable();

  // Current track
  private trackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$: Observable<Track | null> = this.trackSubject.asObservable();

  // Loading
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Cache key
  private cacheKey = 'current-track';

  constructor(private cacheService: LocalStorageCacheService) {
    this.initCurrentTrack();
  }

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
    this.trackSubject.next(track);
    this.cacheService.setItem(this.cacheKey, track);
  }

  // Function to clear the current track
  clearTrack(): void {
    this.trackSubject.next(null);
    this.cacheService.removeItem(this.cacheKey);
  }

  // Function to load the current track
  loadCurrentTrack(): void {
    this.loadingSubject.next(true);
    const cachedTrack = this.cacheService.getItem(this.cacheKey) as Track;
    if (cachedTrack) {
      this.trackSubject.next(cachedTrack);
      this.loadingSubject.next(false);
    } else {
      // API call to fetch current track (if needed)
    }
  }

  // Function to set the volume
  setVolume(volume: number): void {
    this.volumeSubject.next(volume);
  }
}