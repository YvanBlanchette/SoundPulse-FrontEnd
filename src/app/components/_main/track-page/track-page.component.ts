import { ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

//* Component imports
import { PageHeaderComponent } from "@/app/components/_shared/page-header/page-header.component";
import { PageOptionsComponent } from "@/app/components/_shared/page-options/page-options.component";
import { TracksTableComponent } from "@/app/components/_shared/tracks-table/tracks-table.component";
import { ProgressSpinnerComponent } from "@/app/components/_shared/progress-spinner/progress-spinner.component";

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { RoutingService } from '@/app/services/routing.service';
import { FavouritesService } from '@/app/services/favourites.service';
import { CurrentTrackService } from '@/app/services/current-track.service';


@Component({
  selector: 'app-track-page',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    PageOptionsComponent,
    PageHeaderComponent,
    TracksTableComponent
  ],
  templateUrl: './track-page.component.html',
})

  
export class TrackPage implements OnInit, OnDestroy {
  //! Public variables
  trackId: string | null = null;
  isLoading: boolean = true;
  error: string | null = null;


  //! Private variables
  private destroy$ = new Subject<void>();
  private routeParamsSubscription: Subscription = new Subscription;
  private _trackDetails: any = null;
  private _tracks: Track[] = [];


  //! Constructor with dependencie injections
  constructor(
    private currentTrackService: CurrentTrackService,
    public routingService: RoutingService,
    public favouritesService: FavouritesService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }


  //! On Initialize component
  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.trackId = params['id'];
      if (this.trackId) {
        this.getTrackDetails(this.trackId);
      } else {
        console.error('Missing track Id parameter');
      }
    });
  }


  //! On Destroy component
  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.resetState();
    this.destroy$.next();
    this.destroy$.complete();
  }


  //! Reset component states
  resetState(): void {
    this.trackDetails = null;
    this.tracks = [];
    this.isLoading = true;
    this.error = null;
  }


  //! Setter for track details
  set trackDetails(value: any) {
    console.log(value);
    this._trackDetails = value;
    if (value !== null) {
      this.tracks = value.recommendations;
    }
  }


  //! Getter for track details
  get trackDetails(): any {
    return this._trackDetails;
  }


  //! Getter for tracks
  get tracks(): Track[] {
    return this._tracks;
  }


  //! Setter for tracks
  set tracks(value: Track[]) {
    this._tracks = value;
  }


  //! Function to get track details
  getTrackDetails(trackId: string): void {
    this.apiService
      .fetchTrackDetails(trackId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.trackDetails = response;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching track details:', error);
          this.error = error;
          this.isLoading = false;
        },
      });
  }
}