//* Module imports
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

//* Component imports
import { MatSliderModule } from '@angular/material/slider';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';

@Component({
  selector: 'app-volume-controls',
  standalone: true,
  imports: [MatSliderModule, FormsModule, ReactiveFormsModule],
  templateUrl: './volume-controls.component.html',
})
  
export class VolumeControlsComponent implements OnDestroy {
  // Properties
  value: number = 0.5;
  isMuted: boolean = false;
  disabled: boolean = false;
  min: number = 0;
  max: number = 1;
  step: number = 0.1;
  
  private subscription: Subscription;

  constructor(private trackService: CurrentTrackService) {
    this.subscription = this.trackService.volume$.subscribe((volume) => {
      this.value = volume;
    });
  }

  volumeControl = new FormControl(this.value);

  // Lifecycle hooks
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Methods
  private volumeTimeout: any = null;

  setVolume(event: Event) {
    const volume = (event.target as HTMLInputElement).valueAsNumber;
    if (!isNaN(volume) && volume >= 0 && volume <= 100) {
      this.trackService.setVolume(volume);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.disabled = true;
      this.trackService.setVolume(0);
    } else {
      this.disabled = false;
      this.trackService.setVolume(this.value);
    }
  }
}