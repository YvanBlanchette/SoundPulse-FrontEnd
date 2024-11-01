//* Module imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, defer, EMPTY, map, Observable, shareReplay, tap, throwError, timeout } from 'rxjs';

//* Interface imports
import { NewAlbums } from '@/app/interfaces/new-albums';
import { LibraryItem } from '@/app/interfaces/library-item';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

//* Environment imports
import { env } from '@/env/environment';

//* Service imports
import { LocalStorageCacheService } from './local-storage-cache.service';
import { Track } from '../interfaces/track';


//? Enum for item types
enum ItemType {
  Playlist = 'playlist',
  Artist = 'artist',
  Album = 'album',
  Library = 'library',
  NewAlbums = 'new-albums'
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  libraryItems: LibraryItem[] = [];
  private apiUrl = env.API_URL;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  //? Observable for current track
  private currentTrackSubject = new BehaviorSubject<any | null>(null);
  currentTrack$: Observable<any | null> = this.currentTrackSubject.asObservable();

  constructor(private http: HttpClient, private cacheService: LocalStorageCacheService) { }

  //! Function to generate cache key for local storage
  private generateCacheKey(type: ItemType, id: string): string {
    return `cache-${type}-${id}`;
  }

  //! Function to handle errors
  private handleError(error: any) {
    console.error('API Call Error: ', error);
    return throwError(() => error);
  }

  //! Generic function to fetch data from API with caching
  private get<T>(cacheKey: string, endpoint: string): Observable<T> {
    const cachedResponse = this.cacheService.getItem(cacheKey);

    if (cachedResponse) {
      return defer(() => cachedResponse) as Observable<T>;
    } else {
      return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.httpOptions).pipe(
        timeout(10000), // 10 seconds timeout to  display error on the fetch
        catchError((error) => this.handleError(error)),
        shareReplay(1),
        tap((response) => this.cacheService.setItem(cacheKey, response))
      );
    }
  }

  //! Function to get library items
  getLibraryItems(): Observable<LibraryItem[]> {
    const cacheKey = this.generateCacheKey(ItemType.Library, 'all');
    const endpoint = 'library';
  
    return this.get<LibraryItem[]>(cacheKey, endpoint).pipe(
      tap((response) => {
        localStorage.setItem(cacheKey, JSON.stringify(response)); // Store response in cache
      }),
    );
  }

  //! Function to format library items
  getFormattedLibraryItems(): Observable<LibraryItem[]> {
    return this.getLibraryItems().pipe(
      map((libraryItems) => {
        if (!Array.isArray(libraryItems) || libraryItems.length === 0) {
          return []; 
        }
        return libraryItems
          .map((item: LibraryItem) => ({
            ...item,
            image: typeof item.image === 'string' ? JSON.parse(item.image) : item.image,
          }))
          .sort((a, b) => a.type.localeCompare(b.type));
      }),
      catchError((error) => {
        console.error('Error formatting library items:', error);
        return EMPTY;
      })
    );
  }

  //! Function to get artist details
  getArtistDetails(id: string): Observable<ExtendedArtistResponse> {
    const cacheKey = this.generateCacheKey(ItemType.Artist, id);
    const endpoint = `artists/${id}/details`;

    return this.get<ExtendedArtistResponse>(cacheKey, endpoint);
  }

  //! Function to get album details
  getAlbumDetails(id: string, artistId: string): Observable<ExtendedAlbumResponse> {
    const cacheKey = this.generateCacheKey(ItemType.Album, id);
    const endpoint = `albums/${id}/details?artistId=${artistId}`;

    return this.get<ExtendedAlbumResponse>(cacheKey, endpoint);
  }

  //! Function to get playlist details
  getPlaylistDetails(id: string): Observable<any> {
    const cacheKey = this.generateCacheKey(ItemType.Playlist, id);
    const endpoint = `playlists/${id}`;
    
    return this.get<any>(cacheKey, endpoint);
  }

  //! Function to get new albums
  getNewAlbums(): Observable<NewAlbums> {
    const cacheKey = this.generateCacheKey(ItemType.NewAlbums, 'latest');
    const endpoint = 'albums/new-releases';

    return this.http.get<NewAlbums>(`${this.apiUrl}/${endpoint}`, this.httpOptions).pipe(
      timeout(10000), // 10-second timeout
      catchError(this.handleError),
      shareReplay(1),
      tap((response) => this.cacheService.setItem(cacheKey, response))
    );
  }

  //! Function to fetch item details
  fetchItemDetails(item: LibraryItem): Observable<any> {
    return defer(() => {
      switch (item.type) {
        case ItemType.Playlist:
          return this.getPlaylistDetails(item.id);
        case ItemType.Artist:
          return this.getArtistDetails(item.id);
        case ItemType.Album:
          return this.getAlbumDetails(item.id, item.owner_id as string);
        default:
          return throwError(() => new Error(`Unexpected item type: ${item.type}`));
      }
    });
  }

  //! Function to get track details
  getTrackDetails(id: string): Observable<any> {
    const cacheKey = `cache-track-${id}`;
    const endpoint = `tracks/${id}/details`;

    return this.get<any>(cacheKey, endpoint).pipe(
      tap((track) => {
        this.currentTrackSubject.next(track);
        this.cacheService.setItem(cacheKey, track);
      })
    );
  }

  //! Function to clear current track
  clearCurrentTrack(): void {
    this.currentTrackSubject.next(null);
  }

  //! Function to check if a track is in the favorites
  isFavourite(track: Track): boolean {
    const favouriteTrackIds = JSON.parse(localStorage.getItem('favourite-track-ids') || '[]');
    return favouriteTrackIds.includes(track.id);
  }

 
  //! Function to toggle favourite track
toggleFavourite(track: Track): Observable<any> {
  const apiUrl = env.API_URL;
  const endpoint = 'favourites/';
  const trackId = track.id;
  const cacheKey = 'favourite-track-ids';

  // Use isFavourite method to check if track is already a favorite
  const isFavourite = this.isFavourite(track);

  if (isFavourite) {
    // Remove from favourites
    return this.http.delete(`${apiUrl}/${endpoint}${trackId}`, this.httpOptions).pipe(
      catchError(this.handleError),
      tap(() => {
        track.isFavourite = false;
        this.updateCache(cacheKey, trackId, false);
      })
    );
  } else {
    // Add to favourites
    const favouriteData = {
      song_id: trackId,
      name: track.name,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      artists: track.artists,
      album: track.album,
      rating: track.rating,
    };

    return this.http.post(`${apiUrl}/${endpoint}`, favouriteData, this.httpOptions).pipe(
      catchError(this.handleError),
      tap(() => {
        track.isFavourite = true;
        this.updateCache(cacheKey, trackId, true);
      })
    );
  }
}

  //! Helper function to update cache without expiration
  private updateCache(cacheKey: string, trackId: string, isFavourite: boolean) {
    const storedIds = localStorage.getItem(cacheKey);
    let favouriteTrackIds = storedIds ? JSON.parse(storedIds) : [];

    if (isFavourite) {
      favouriteTrackIds.push(trackId);
    } else {
      favouriteTrackIds = favouriteTrackIds.filter((id: string) => id !== trackId);
    }

    localStorage.setItem(cacheKey, JSON.stringify(favouriteTrackIds));
  }
}
