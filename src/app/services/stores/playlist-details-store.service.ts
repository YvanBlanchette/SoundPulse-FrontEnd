import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable } from 'rxjs';

//* Interface imports
import { PlaylistResponse } from '@/app/interfaces/playlist-response';

//* Service imports
import { ApiService } from '@/app/services/api-service.service';
import { LocalStorageCacheService } from '@/app/services/local-storage-cache.service';

@Injectable({ providedIn: 'root' })
export class PlaylistDetailsStoreService {
  //? Create new observable subjects
  private playlistSubject = new BehaviorSubject<PlaylistResponse | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  //? Get observables from subjects
  playlist$: Observable<PlaylistResponse | null> = this.playlistSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  //? Cache key
  private cacheKey!: string;

  constructor(private apiService: ApiService, private cacheService: LocalStorageCacheService) {
    this.initPlaylistDetails();
  }

  //! Initialize playlist details from cache
  private initPlaylistDetails(): void {
    const id = localStorage.getItem('playlistId');
    if (id) {
      this.cacheKey = `cache-playlist-${id}`;
      const cachedPlaylist = this.cacheService.getItem(this.cacheKey) as PlaylistResponse;
      
      if (cachedPlaylist) {
        this.playlistSubject.next(cachedPlaylist);
      }
    }
  }

  //! Function to load playlist details and store in cache
  loadPlaylistDetails(id: string): Observable<any> {
    return this.apiService.getPlaylistDetails(id).pipe(
      catchError((error) => {
        console.error('Error loading playlist details:', error);
        // Handle error or return a default value
        return EMPTY;
      })
    );
  }

  //! Function to reset playlist details and remove from cache
  resetPlaylistDetails(id: string): void {
    const cacheKey = `cache-playlist-${id}`;
    this.playlistSubject.next(null);
    this.loadingSubject.next(false); // Set loading to false
    this.cacheService.removeItem(cacheKey);
  }
}