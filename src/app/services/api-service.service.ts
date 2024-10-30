import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, shareReplay, firstValueFrom, tap, map } from 'rxjs';
import { LocalStorageCacheService } from './local-storage-cache.service';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

//* Environment imports
import { env } from '@/env/environment';
import { Injectable } from '@angular/core';

enum ItemType {
  Playlist = 'Liste de lecture',
  Artist = 'Artiste',
  Album = 'Album'
}

/**
 * Service to manage API request calls and caching.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  //? Get the API_URL from the environment file
  private apiUrl = env.API_URL;

  //! Inject the HttpClient and LocalStorageCacheService
  constructor(private http: HttpClient, private cacheService: LocalStorageCacheService) { }


  //! Generic function to make GET API request with caching (shareReplay)
  get(cacheKey: string): Observable<any> {
    const originalCacheKey = cacheKey;
    cacheKey = cacheKey.replace('cache-', '');
  
    // Check cache before making API request
    const cachedResponse = this.cacheService.getItem(originalCacheKey);
  
    // If there is a cached response, create an observable with it
    if (cachedResponse) {
      return new Observable((observer) => observer.next(cachedResponse));
    }
  
    // Define the endpoint based on the cacheKey
    let endpoint = cacheKey;
    
    if (endpoint.includes('artist-')) {
      endpoint = `artists/${endpoint.replace('artist-', '')}/details`;
    } else if (endpoint.includes('album-')) {
      endpoint = `albums/${endpoint.replace('album-', '')}/details`;
    } else if (endpoint === 'library') {
      endpoint = 'library';
    }
  
    // If there is no cached response, make the API request
    return this.http.get(`${this.apiUrl}/${endpoint}`).pipe(
      catchError((error) => {
        console.error('API Call Error: ', error);
        return throwError(() => error);
      }),
      shareReplay(1),
      tap((response) => this.cacheService.setItem(originalCacheKey, response))
    );
  }


  //! Get library items from API
  getLibraryItems(): Observable<LibraryItem[]> {
    const cacheKey = 'cache-library';
    return this.get(cacheKey);
  }

  //! Get artists. albums and playlists details
  getArtistDetails(id: string): Observable<ExtendedArtistResponse> {
    const cacheKey = `cache-artist-${id}`;
    return this.get(cacheKey).pipe(
      map((response: any) => response as ExtendedArtistResponse)
    );
  }
  
  getAlbumDetails(id: string, artistId: string): Observable<ExtendedAlbumResponse> {
    const cacheKey = `cache-album-${id}`;
    const endpoint = `albums/${id}/details?artistId=${artistId}`;
  
    // Check cache before making API request
    const cachedAlbum = this.cacheService.getItem(cacheKey);
    
    if (cachedAlbum) {
      return new Observable((observer) => observer.next(cachedAlbum));
    }
  
    // Make API request
    return this.http.get(`${this.apiUrl}/${endpoint}`).pipe(
      catchError((error) => {
        console.error('API Call Error: ', error);
        return throwError(() => error);
      }),
      shareReplay(1),
      tap((response) => this.cacheService.setItem(cacheKey, response)),
      map((response: any) => response as ExtendedAlbumResponse)
    );
  }
  
  
  getPlaylistDetails(id: string): Observable<any> {
    const cacheKey = `cache-playlist-${id}`;
    return this.get(cacheKey);
  }


  //! Get library items (Also parsing the image JSON to object)
  getFormattedLibraryItems(): Observable<LibraryItem[]> {
    return this.getLibraryItems().pipe(
      map((libraryItems: any[]) => {
        return libraryItems.map((item: any) => ({
          ...item,
          image: JSON.parse(item.image),
        })) as LibraryItem[];
      }),
      tap((libraryItems: LibraryItem[]) => {
        const typeOrder = {
          'Liste de lecture': 0,
          'Artiste': 1,
          'Album': 2,
        };
        libraryItems.sort((a, b) => typeOrder[a.type as keyof typeof typeOrder] - typeOrder[b.type as keyof typeof typeOrder]);
      })
    );
  }


  //! Fetch item details
  async fetchItemDetails(item: LibraryItem): Promise<any> {
    try {
      switch (item.type) {
        case ItemType.Playlist:
          return await firstValueFrom(this.getPlaylistDetails(item.id));
        case ItemType.Artist:
          return await firstValueFrom(this.getArtistDetails(item.id));
        case ItemType.Album:
          return await firstValueFrom(this.getAlbumDetails(item.id, (item.owner_id as string)));
        default:
          console.error(`Unexpected item type: ${item.type}`);
          return null;
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      return null;
    }
  }
}