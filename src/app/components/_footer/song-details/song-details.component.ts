//* Module imports
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Service imports
import { TrackService } from '@/app/services/track.service';

//* Component imports
import { LibraryItemComponent } from "@/app/components/_sidebar/library-item/library-item.component";

@Component({
  selector: 'app-song-details',
  standalone: true,
  imports: [LibraryItemComponent],
  templateUrl: './song-details.component.html',
})
  
export class SongDetailsComponent implements OnInit, OnDestroy {
  @Input()
  track: Track | null = null;
  private subscription: Subscription | null = null;

  constructor(private trackService: TrackService) { }

  // Lifecycle hooks
  ngOnInit(): void {
    console.log('Subscribing to currentTrack$');
    this.subscription = this.trackService.currentTrack$.subscribe((track) => {
      console.log('Received track:', track);
      this.track = track;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}