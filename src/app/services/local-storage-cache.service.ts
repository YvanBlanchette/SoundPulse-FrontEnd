import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalStorageCacheService {
  
  //? Reference to the local storage
  private storage: Storage = localStorage;

  //? Expiry duration for cachied items (1 hour)
  private expiryDuration: number = 60 * 60 * 1000;


  //! Function to get item from cache
  getItem(key: string): any {
    const cachedData = this.storage.getItem(key);
    if (cachedData) {
      const { data, expiry } = JSON.parse(cachedData);
      if (expiry > Date.now()) {
        return data; // Return cached data if not expired
      } else {
        this.removeItem(key); // Remove expired item
      }
    }
    return null;
  }


  //! Function to set item in cache
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }


  //! Function to check if item exists in cache
  hasItem(key: string): boolean {
    return this.storage.getItem(key) !== null; // Check if item exists
  }


  //! Function to remove item from cache
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }


  //! Function to clear entire cache
  clearCache(): void {
    this.storage.clear(); // Clear entire cache
  }


  //! Function to get item from cache or fetch it from the Api
  getOrFetchItem(key: string, fetchFunction: () => Observable<any>): Observable<any> {
    const cachedItem = this.getItem(key);
    if (cachedItem) {
      return of(cachedItem);
    } else {
      return fetchFunction().pipe(
        tap((item) => this.setItem(key, item))
      );
    }
  }
}