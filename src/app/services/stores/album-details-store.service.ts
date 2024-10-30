import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

//* Interface imports
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

//* Service imports
import { ApiService } from '@/app/services/api-service.service';
import { LocalStorageCacheService } from '@/app/services/local-storage-cache.service';

@Injectable({ providedIn: 'root' })
export class AlbumDetailsStoreService {
  //? Create new observable subjects
  private albumSubject = new BehaviorSubject<ExtendedAlbumResponse | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  //? Get observables from subjects
  album$: Observable<ExtendedAlbumResponse | null> = this.albumSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  //? Cache key
  private cacheKey!: string;

  constructor(private apiService: ApiService, private cacheService: LocalStorageCacheService) {
    this.initAlbumDetails();
  }

  //! Initialize album details from cache
  private initAlbumDetails(): void {
    const id = localStorage.getItem('albumId');
    if (id) {
      this.cacheKey = `cache-album-${id}`;
      const cachedAlbum = this.cacheService.getItem(this.cacheKey) as ExtendedAlbumResponse;
      
      if (cachedAlbum) {
        this.albumSubject.next(cachedAlbum);
      }
    }
  }

  //! Function to load album details and store in cache
  loadAlbumDetails(id: string, artistId: string): void {
    this.loadingSubject.next(true); // Set loading to true
    const cacheKey = `cache-album-${id}`;
    const cachedAlbum = this.cacheService.getItem(cacheKey) as ExtendedAlbumResponse;
    
    if (cachedAlbum) {
      this.albumSubject.next(cachedAlbum);
      this.loadingSubject.next(false); // Set loading to false
    } else {
      this.apiService.getAlbumDetails(id, artistId).subscribe((album: ExtendedAlbumResponse) => {
        this.cacheService.setItem(cacheKey, album);
        this.albumSubject.next(album);
        this.loadingSubject.next(false); // Set loading to false
      });
    }
  }

  //! Function to reset album details and remove from cache
  resetAlbumDetails(id: string): void {
    const cacheKey = `cache-album-${id}`;
    this.albumSubject.next(null);
    this.loadingSubject.next(false); // Set loading to false
    this.cacheService.removeItem(cacheKey);
  }
}