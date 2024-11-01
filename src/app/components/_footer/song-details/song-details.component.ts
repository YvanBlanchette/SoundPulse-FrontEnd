import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';
import { LibraryItemComponent } from "../../_sidebar/library-item/library-item.component";

@Component({
  selector: 'app-song-details',
  standalone: true,
  templateUrl: './song-details.component.html',
  imports: [LibraryItemComponent],
})
export class SongDetailsComponent implements OnInit, OnDestroy {
  track!: Track | null | undefined;

  private destroy$ = new Subject<void>();
  private subscription$: Subscription | null = null;

  constructor(private currentTrackService: CurrentTrackService) { }

  // Lifecycle hooks
  ngOnInit(): void {
    this.subscription$ = this.currentTrackService.currentTrack$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((track) => {
      if (track) {
        this.track = track;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}