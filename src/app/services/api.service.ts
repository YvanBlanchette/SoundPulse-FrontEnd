import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, retry, shareReplay, tap, throwError, timeout } from 'rxjs';

//* Interface imports
import { NewAlbums } from '@/app/interfaces/new-albums';
import { LibraryItem } from '@/app/interfaces/library-item';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';

//* Environment imports
import { env } from '@/env/environment';

import { SearchResults } from '@/app/interfaces/search-results';
import { Track } from '@/app/interfaces/track';
import { PlaylistResponse } from '@/app/interfaces/playlist-response';
import { User } from '@/app/interfaces/user';

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
  private apiUrl = env.API_URL;
  private token = localStorage.getItem('token');
  private httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',  
      'Authorization': `Bearer ${this.token}`
    }),
  };

  //? Observable for current track
  private currentTrackSubject = new BehaviorSubject<any | null>(null);

  currentTrack$: Observable<any | null> = this.currentTrackSubject.asObservable();

  constructor(private http: HttpClient) { }

  //! Function to handle errors
  private handleError(error: any) {
    console.error('API Call Error: ', error);
    
    if (error.status === 401) {
      // Handle unauthorized error
      // Logout user, redirect to login page, etc.
    } else if (error.status === 500) {
      // Handle internal server error
      // Display error message to user, etc.
    }
    
    return throwError(() => error);
  }

  //! Generic function to fetch data from API
  private get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.httpOptions).pipe(
      retry(2),
      timeout(10000),
      catchError((error) => this.handleError(error)),
      shareReplay(1)
    );
  }

  //! Function to get library items
  getLibraryItems(): Observable<LibraryItem[]> {
    return this.get<LibraryItem[]>('library');
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
        return of([]);
      })
    );
  }

  //! Function to add a new item to the library
  addLibraryItem(item: LibraryItem): Observable<LibraryItem> {
    return this.http.post<LibraryItem>(`${this.apiUrl}/library`, item, this.httpOptions).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  //! Function to remove an item to the library
  removeLibraryItem(id: string): Observable<LibraryItem> {
    return this.http.delete<LibraryItem>(`${this.apiUrl}/library/${id}`, this.httpOptions).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  //! Function to get album details
  fetchAlbumDetails(albumId: string, artistId: string): Observable<ExtendedAlbumResponse> {
    return this.get<ExtendedAlbumResponse>(`albums/${albumId}?artistId=${artistId}`);
  }

  //! Function to get artist details
  fetchArtistDetails(artistId: string): Observable<ExtendedArtistResponse> {
    return this.get<ExtendedArtistResponse>(`artists/${artistId}`);
  }

  fetchTrackDetails(id: string): Observable<any> {
    return this.get<any>(`tracks/${id}/details`).pipe(
      tap((track) => {
        this.currentTrackSubject.next(track);
      }),
      catchError((error) => {
        console.error('Error fetching track details:', error);
        return throwError(() => error);
      })
    );
  }

  //! Function to get playlist details
  fetchPlaylistDetails(Id: string): Observable<PlaylistResponse> {
    return this.get<PlaylistResponse>(`playlists/${Id}`);
  }

  //! Function to get favourite songs
  fetchFavourites(): Observable<PlaylistResponse> {
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/favourites`, this.httpOptions);
  }

  //! Function to format favourite songs
  fetchFormattedFavourites(): Observable<PlaylistResponse[]> {
    return this.fetchFavourites().pipe(
      map((response) => {
        if (!Array.isArray(response) || response.length === 0) {
          return []; 
        }
        return response
          .map((item: any) => ({
            ...item,
            artists: typeof item.artists === 'string' ? JSON.parse(item.artists) : item.artists,
          }));
      }),
      catchError((error) => {
        console.error('Error formatting library items:', error);
        return of([]);
      })
    );
  }


  //! Function to get new albums
  getNewAlbums(): Observable<NewAlbums> {
    return this.get<NewAlbums>('albums/new-releases');
  }

  //! Function to check if a track is in the favorites
  isFavourite(track: Track): boolean {
    const favouriteTrackIds = JSON.parse(localStorage.getItem('favourite-track-ids') || '[]');
    return favouriteTrackIds.includes(track.id);
  }
  
  //! Function to toggle favourite track
  toggleFavourite(track: Track): Observable<any> {
    const apiUrl = env.API_URL;
    const endpoint = 'favourites';
    const trackId = track.id;
  
    // Use isFavourite method to check if track is already a favorite
    const isFavourite = this.isFavourite(track);
  
    if (isFavourite) {
      // Remove from favourites
      return this.http.delete(`${apiUrl}/${endpoint}/${trackId}`, this.httpOptions).pipe(
        catchError(this.handleError),
        tap(() => {
          track.isFavourite = false;
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
        })
      );
    }
  }


  //! Function to get search results
  getSearchResults(query: string, type: string = 'track,artist,album,playlist'): Observable<SearchResults> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    return this.http.get<SearchResults>(`${this.apiUrl}/search?q=${query}&type=${type}`, this.httpOptions).pipe(
      retry(2),
      timeout(10000),
      catchError(this.handleError),
      shareReplay(1)
    );
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, this.httpOptions).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user`, user, this.httpOptions).pipe(
      catchError((error) => this.handleError(error))
    );
  }
}
