import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, retry, shareReplay, tap, throwError, timeout } from 'rxjs';

//* Interface imports
import { User } from '@/app/interfaces/user';
import { NewAlbums } from '@/app/interfaces/new-albums';
import { LibraryItem } from '@/app/interfaces/library-item';
import { SearchResults } from '@/app/interfaces/search-results';
import { LoginResponse } from '@/app/interfaces/login-response';
import { FavouriteTrack } from '@/app/interfaces/favourite-track';
import { PlaylistResponse } from '@/app/interfaces/playlist-response';
import { ExtendedAlbumResponse } from '@/app/interfaces/extended-album-response';
import { FavouriteTrackRequest } from '@/app/interfaces/favourite-track-request';
import { ExtendedArtistResponse } from '@/app/interfaces/extended-artist-response';

//* Environment imports
import { env } from '@/env/environment';


@Injectable({ providedIn: 'root' })
export class ApiService {
  // API URL
  private apiUrl = env.API_URL;

  // Token
  private token: string | null = localStorage.getItem('token');

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    }),
  };


  // Observable for current track
  private currentTrackSubject = new BehaviorSubject<any | null>(null);
  currentTrack$: Observable<any | null> = this.currentTrackSubject.asObservable();


  // Constructor with dependency injection
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // Function to handle errors
  private handleError(error: any) {
    console.error('API Call Error: ', error);
    return throwError(() => error);
  }


  // Generic API call function depending on the HTTP method
  private apiCall<T>(method: string, endpoint: string, body?: any): Observable<T> {
    switch (method.toUpperCase()) {
      case 'GET':
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.httpOptions).pipe(
          retry(3),
          timeout(10000),
          catchError((error) => this.handleError(error)),
          shareReplay(1)
        );
      case 'POST':
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, this.httpOptions).pipe(
          retry(3),
          timeout(10000),
          catchError((error) => this.handleError(error)),
          shareReplay(1)
        );
      case 'PUT':
        return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, this.httpOptions).pipe(
          retry(3),
          timeout(10000),
          catchError((error) => this.handleError(error)),
          shareReplay(1)
        );
      case 'DELETE':
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, this.httpOptions).pipe(
          retry(3),
          timeout(10000),
          catchError((error) => this.handleError(error)),
          shareReplay(1)
        );
      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }
  }



  // -------------------------------- LIBRARY -------------------------------- //

  // Function to get library items (GET request)
  getLibraryItems(): Observable<LibraryItem[]> {
    return this.apiCall<LibraryItem[] | { message: string }>('GET', 'library').pipe(
      map((response) => Array.isArray(response) ? response : []),
      catchError((error: any) => {
        console.error('Error fetching library items:', error);
        return of([]);
      })
    );
  }


  // Function to format library items
  getFormattedLibraryItems(): Observable<LibraryItem[]> {
    return this.getLibraryItems().pipe(
      // Map the response to an array of library items
      map((libraryItems) => {
        if (!Array.isArray(libraryItems) || libraryItems.length === 0) {
          return [];
        }
        return libraryItems
          .map((item: LibraryItem) => ({
            ...item,
            images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images,
          }))
          .sort((a, b) => a.type.localeCompare(b.type));
      }),
      catchError((error) => {
        console.error('Error formatting library items:', error);
        return of([]);
      })
    );
  }


  // Function to add a new item to the library (POST request)
  addLibraryItem(item: LibraryItem): Observable<LibraryItem> {
    return this.apiCall<LibraryItem>('POST', 'library', item);
  }


  // Function to remove an item to the library (DELETE request)
  removeLibraryItem(id: string): Observable<LibraryItem> {
    return this.apiCall<LibraryItem>('DELETE', `library/${id}`);
  }



  // -------------------------------- ITEMS DETAILS -------------------------------- //

  // Function to get album details (GET request)
  fetchAlbumDetails(albumId: string, artistId: string): Observable<ExtendedAlbumResponse> {
    return this.apiCall<ExtendedAlbumResponse>('GET', `albums/${albumId}?artistId=${artistId}`);
  }


  // Function to get artist details (GET request)
  fetchArtistDetails(artistId: string): Observable<ExtendedArtistResponse> {
    return this.apiCall<ExtendedArtistResponse>('GET', `artists/${artistId}`);
  }


  // Function to get track details (GET request)
  fetchTrackDetails(id: string): Observable<any> {
    return this.apiCall<any>('GET', `tracks/${id}/details`).pipe(
      tap((track) => {
        this.currentTrackSubject.next(track);
      }),
      catchError((error) => {
        console.error('Error fetching track details:', error);
        return throwError(() => error);
      })
    );
  }


  // Function to get playlist details (GET request)
  fetchPlaylistDetails(Id: string): Observable<PlaylistResponse> {
    return this.apiCall<PlaylistResponse>('GET', `playlists/${Id}`);
  }


  // Function to get new albums (GET request)
  getNewAlbums(): Observable<NewAlbums> {
    return this.apiCall<NewAlbums>('GET', 'albums/new-releases');
  }



  // -------------------------------- FAVOURITE SONGS -------------------------------- //

  // Function to get favourite songs (GET request)
  getFavouriteSongs(): Observable<FavouriteTrack[]> {
    return this.apiCall<FavouriteTrack[]>('GET', 'favourites');
  }


  // Function to format favourite songs
  getFormattedFavouriteSongs(): Observable<FavouriteTrack[]> {
    // Fetch favourite songs
    return this.getFavouriteSongs().pipe(
      // Map the response to an array of favourite tracks
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


  /// Function to add favourite track (POST request)
  addFavouriteSong(trackRequest: FavouriteTrackRequest): Observable<any> {
    // Prepare the song data
    const songData = {
      song_id: trackRequest.song_id,
      name: trackRequest.name,
      duration_ms: trackRequest.duration_ms,
      artists: trackRequest.artists,
      preview_url: trackRequest.preview_url
    };

    // Make the request
    return this.apiCall('POST', 'favourites', songData).pipe(
      tap(() => {
        // Get the favourite track ids from local storage
        const favouriteTrackIds = JSON.parse(localStorage.getItem('favourite-track-ids') || '[]');
        // Add the new track id
        favouriteTrackIds.push(trackRequest.song_id);
        // Set the updated track ids to local storage
        localStorage.setItem('favourite-track-ids', JSON.stringify(favouriteTrackIds))
      })
    );
  }


  // Function to remove a track from the favourites (DELETE request)
  removeFavouriteSong(trackRequest: FavouriteTrackRequest): Observable<any> {
    return this.apiCall('DELETE', `favourites/${trackRequest.song_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 404 error
        if (error.status === 404) {
          console.error('Chanson non trouvée dans les favoris.');
        } else {
          console.error('Une erreur s\'est produite: ', error);
        }
        return throwError(() => error);
      })
    );
  }

  // Function to check if a track is in the favourites (GET request)
  isFavourite(id: string): Observable<any> {
    return this.apiCall('GET', `favourites/is_favourite/${id}`);
  }



  // -------------------------------- SEARCH RESULTS -------------------------------- //

  // Function to get search results (GET request)
  getSearchResults(query: string, type: string = 'track,artist,album,playlist'): Observable<SearchResults> {
    // Check if the query is not empty
    if (!query.trim()) {
      throw new Error('La recherche ne peut pas être vide.');
    }

    // Make the API request with the query parameter
    return this.apiCall<SearchResults>('GET', `search?q=${query}&type=${type}`);
  }



  // -------------------------------- AUTH -------------------------------- //

  // Function to update the auth token
  updateToken(): void {
    // Get the token from local storage
    this.token = localStorage.getItem('token');
    // Update the HTTP options with the new token
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }


  // Function to login to account
  login(email: string, password: string): Observable<LoginResponse> {
    // Prepare the login data
    const data = { email, password };

    // Make the API request with the login data as parameters
    return this.apiCall<LoginResponse>('POST', 'login', data).pipe(
      // Update the auth token
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.updateToken();
        // Navigate to the home page
        this.router.navigate(['/']);
      })
    );
  }

  // Function to register a new account
  register(name: string, email: string, password: string): Observable<LoginResponse> {
    // Prepare the registration data
    const data = { name, email, password };

    // Make the API request with the registration data as parameters
    return this.apiCall<LoginResponse>('POST', 'register', data).pipe(
      // Update the auth token
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.updateToken();
        // Navigate to the home page
        this.router.navigate(['/']);
      })
    );
  }


  // Function to logout
  logout(): Observable<any> {
    // Make the API request
    return this.apiCall('POST', 'logout').pipe(
      // Remove the auth token from local storage
      tap((response) => {
        localStorage.removeItem('token');
        this.updateToken();
        // Redirect to the auth page
        this.router.navigate(['/auth']);
      })
    );
  }


  // Function to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }



  // -------------------------------- USER -------------------------------- //

  // Function to get the current user (GET request)
  getUser(): Observable<User> {
    return this.apiCall<User>('GET', 'user');
  }


  // Function to update the current user (PUT request)
  updateUser(user: User): Observable<User> {
    return this.apiCall<User>('PUT', 'user', user);
  }


  // Function to delete the current user account (DELETE request)
  deleteUser(userId: number): Observable<any> {
  // Prepare the URL
    const url = `user/${userId}`;

    // Make the request
    return this.apiCall<User>('DELETE', url).pipe(
      tap(() => {
        // Remove the auth token from local storage
        localStorage.removeItem('token');
        // Update the token
        this.updateToken();
        // Redirect to the auth page
        this.router.navigate(['/auth']);
      }),
      catchError((error) => {
        // Handle the error
        console.error('Erreur de suppression:', error);
        throw error;
      })
  );
}
}