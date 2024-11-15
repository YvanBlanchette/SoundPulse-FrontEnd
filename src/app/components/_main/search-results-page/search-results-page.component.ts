import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Subscription, switchMap, tap } from 'rxjs';

//* Component imports
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { CollectionComponent } from "@/app/components/_shared/collection/collection.component";
import { TracksTableComponent } from "@/app/components/_shared/tracks-table/tracks-table.component";
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';

//* Interface imports
import { SearchResults, Track, Artist, Album, Playlist } from '@/app/interfaces/search-results';

//* Service imports
import { ApiService } from '@/app/services/api.service';


@Component({
  selector: 'app-search-results-page',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    CollectionComponent,
    TracksTableComponent,
  ],
  templateUrl: './search-results-page.component.html',
})


export class SearchResultsPage implements OnInit {
  query: string = '';
  searchResults: SearchResults | null = null; 
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: Track[] = [];
  playlists: Playlist[] = [];
  searchResultsSubscription!: Subscription;
  searchBackground: string = 'https://images.unsplash.com/photo-1487537023671-8dce1a785863?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  isLoading: boolean = true;
  error: string = '';

  // Constructor with dependencie injections
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }


  // On component initialization
  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap((params) => {
        this.query = params['query'] || '';
      }),
      switchMap((params) => 
        this.apiService.getSearchResults(this.query).pipe(
          tap((response) => {
            this.searchResults = response;
            this.filterResultsByType();
            this.isLoading = false;
          }),
          catchError((error) => {
            console.error('Error searching: ', error);
            this.error = error;
            this.isLoading = false;
            return EMPTY;
          })
        )
      )
    ).subscribe();
  }


  // Filter search results by type
  filterResultsByType(): void {
    if (!this.searchResults) return;
    this.tracks = this.searchResults.tracks;
    this.artists = this.searchResults.artists;
    this.albums = this.searchResults.albums;
    this.playlists = this.searchResults.playlists;
  }
}