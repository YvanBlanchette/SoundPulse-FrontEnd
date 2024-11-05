import { SearchResults } from '@/app/interfaces/search-results';
import { ApiService } from '@/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Subscription, switchMap, tap } from 'rxjs';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { Track } from '@/app/interfaces/track';
import { MatTableModule } from '@angular/material/table';
import { ProgressSpinnerComponent } from '../../_shared/progress-spinner/progress-spinner.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CollectionComponent } from "../_search-results/collection/collection.component";
import { TracksTableComponent } from "../_search-results/tracks-table/tracks-table.component";

@Component({
  selector: 'app-search-results-page',
  standalone: true,
  imports: [
    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgFor,
    NgIf,
    NgClass,
    CollectionComponent,
    TracksTableComponent
],
  templateUrl: './search-results-page.component.html',
  styleUrls: ['./search-results-page.component.css']
})


export class SearchResultsPage implements OnInit {
  query: string = '';
  searchResults?: any; 
  searchResultsSubscription!: Subscription;
  searchBackground: string = 'https://images.unsplash.com/photo-1487537023671-8dce1a785863?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  isLoading: boolean = true;
  error: any = null;
  tracks: any | null | undefined = null;
  

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private currentTrackService: CurrentTrackService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap((params) => {
        this.query = params['query'] || '';
      }),
      switchMap((params) => 
        this.apiService.getSearchResults(this.query).pipe(
          tap((response) => {
            this.searchResults = response;
            console.log(this.searchResults);
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

   
  
  onItemClick(item: any): void {
    console.log(item);
    if(item.type === 'track') {
      this.router.navigate(['/tracks', item.id]);
    } else if(item.type === 'album') {
      this.router.navigate(['/albums', item.id]);
    } else if(item.type === 'playlist') {
      this.router.navigate(['/playlists', item.id]);
    } else if (item.type === 'artist') {
      this.router.navigate(['/artists', item.id]);
    }
  }
}