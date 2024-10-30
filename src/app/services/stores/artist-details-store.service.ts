import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

//* Interface imports
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';

//* Service imports
import { ApiService } from '@/app/services/api-service.service';
import { LocalStorageCacheService } from '@/app/services/local-storage-cache.service';

@Injectable({ providedIn: 'root' })
export class ArtistDetailsStoreService {
  //? Create new observable subjects
  private artistSubject = new BehaviorSubject<ExtendedArtistResponse | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  //? Get observables from subjects
  artist$: Observable<ExtendedArtistResponse | null> = this.artistSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService, private cacheService: LocalStorageCacheService) {
    this.initArtistDetails();
  }

  //! Initialize artist details from cache
  private initArtistDetails(): void {
    const id = localStorage.getItem('artistId');
    if (id) {
      const cacheKey = `cache-artist-${id}`;
      const cachedArtist = this.cacheService.getItem(cacheKey) as ExtendedArtistResponse;
      
      if (cachedArtist) {
        this.artistSubject.next(cachedArtist);
      }
    }
  }

  //! Function to load artist details
  loadArtistDetails(id: string): void {
    this.loadingSubject.next(true); // Set loading to true
    const cacheKey = `cache-artist-${id}`;
    const cachedArtist = this.cacheService.getItem(cacheKey) as ExtendedArtistResponse;
    
    if (cachedArtist) {
      this.artistSubject.next(cachedArtist);
      this.loadingSubject.next(false); // Set loading to false
    } else {
      this.apiService.getArtistDetails(id).subscribe((artist: ExtendedArtistResponse) => {
        this.cacheService.setItem(cacheKey, artist);
        this.artistSubject.next(artist);
        this.loadingSubject.next(false); // Set loading to false
      });
    }
  }

  //! Function to reset artist details
  resetArtistDetails(id: string): void {
    const cacheKey = `cache-artist-${id}`;
    this.artistSubject.next(null);
    this.loadingSubject.next(false); // Set loading to false
    this.cacheService.removeItem(cacheKey);
  }
}