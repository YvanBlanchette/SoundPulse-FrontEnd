import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

//* Interface imports
import { SearchResults } from '@/app/interfaces/search-results';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { LocalStorageCacheService } from '@/app/services/local-storage-cache.service';

@Injectable({ providedIn: 'root' })
export class SearchResultStoreService {
  //? Create new observable subjects
  private searchResultSubject = new BehaviorSubject<SearchResults | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private querySubject = new BehaviorSubject<string>('');

  //? Get observables from subjects
  searchResult$: Observable<SearchResults | null> = this.searchResultSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  query$: Observable<string> = this.querySubject.asObservable();

  //? Cache key
  private cacheKey!: string;

  constructor(private apiService: ApiService, private cacheService: LocalStorageCacheService) {}

  //! Initialize search result from cache
  private initSearchResult(query: string): void {
    this.cacheKey = `cache-search-${query}`;
    const cachedSearchResult = this.cacheService.getItem(this.cacheKey) as SearchResults;
    
    if (cachedSearchResult) {
      this.searchResultSubject.next(cachedSearchResult);
    }
  }

  //! Function to load search result and store in cache
  loadSearchResult(query: string, type: string = 'track,artist,album,playlist'): void {
    this.loadingSubject.next(true); // Set loading to true
    this.querySubject.next(query); // Update query subject
    const cacheKey = `cache-search-${query}`;
    const cachedSearchResult = this.cacheService.getItem(cacheKey) as SearchResults;
    
    if (cachedSearchResult) {
      this.searchResultSubject.next(cachedSearchResult);
      this.loadingSubject.next(false); // Set loading to false
    } else {
      this.apiService.getSearchResults(query, type).pipe(
        catchError((error) => {
          console.error('Error loading search results:', error);
          this.loadingSubject.next(false); // Set loading to false
          return throwError(() => error);
        })
      ).subscribe((searchResult: SearchResults) => {
        this.cacheService.setItem(cacheKey, searchResult);
        this.searchResultSubject.next(searchResult);
        this.loadingSubject.next(false); // Set loading to false
      });
    }
  }

  //! Function to reset search result and remove from cache
  resetSearchResult(query: string): void {
    const cacheKey = `cache-search-${query}`;
    this.searchResultSubject.next(null);
    this.loadingSubject.next(false); // Set loading to false
    this.cacheService.removeItem(cacheKey);
  }
}