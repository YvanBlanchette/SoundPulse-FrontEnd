//* Module imports
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';
import { LocalStorageCacheService } from './local-storage-cache.service';


/** 
 * Service for managing the selected library item
 */ 
@Injectable({
  providedIn: 'root'
})
  
export class SelectedLibraryItemService {

  //? Subject for emitting the currently selected library item
  private selectedItemSubject = new BehaviorSubject<LibraryItem | null>(null);

  //? Observable for subscribing to selected library item changes
  selectedItem$ = this.selectedItemSubject.asObservable();

  //? Key for caching the selected library item in local storage
  private cacheKey = 'cache-selected-library-item';


  //! Function to initialize the service and retrieve the cached selected library item.
  constructor(private cacheService: LocalStorageCacheService) {
    this.initSelectedItem();
  }


  //! Function to set the selected library item and cache it
  setSelectedItem(item: LibraryItem): void {
    if (!item) {
      console.error('Invalid library item');
      return;
    }
    this.selectedItemSubject.next(item);
    this.cacheService.setItem(this.cacheKey, item); // Cache indefinitely
  }


  //! Function to retrieve the currently selected library item
  getSelectedItem(): LibraryItem | null {
    return this.selectedItemSubject.value;
  }


  //! Function to clear the selected library item and remove it from the cache
  clearSelectedItem(): void {
    this.selectedItemSubject.next(null);
    this.cacheService.removeItem(this.cacheKey);
  }


  //! Function to Initialize the selected library item from its cached value
  private initSelectedItem(): void {
    // Retrieve cached item and emit it if valid
    const cachedItem = this.cacheService.getItem(this.cacheKey) as LibraryItem | null;
    
    if (cachedItem) {
      this.selectedItemSubject.next(cachedItem);
    }
  }
}