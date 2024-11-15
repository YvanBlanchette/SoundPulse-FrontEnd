import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Service imports
import { RoutingService } from '@/app/services/routing.service';
import { CurrentTrackService } from '@/app/services/current-track.service';

@Component({
  selector: 'app-song-details',
  standalone: true,
  templateUrl: './song-details.component.html',
  imports: [],
})
export class SongDetailsComponent implements OnInit, OnDestroy {
  track!: Track | null | undefined;

  // Private variables
  private destroy$ = new Subject<void>();
  private subscription$: Subscription | null = null;

  // Constructor with dependency injections
  constructor(
    private currentTrackService: CurrentTrackService,
    public routingService: RoutingService
  ) { }


  // On initialize component
  ngOnInit(): void {
    this.subscription$ = this.currentTrackService.currentTrack$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((track) => {
      if (track) {
        this.track = track;
      }
    });
  }

  // On destroy component
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}