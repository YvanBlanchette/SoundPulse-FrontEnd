//* Module imports
import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
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
  // Public variables
  value: number = 0.5;
  isMuted: boolean = false;
  disabled: boolean = false;
  min: number = 0;
  max: number = 1;
  step: number = 0.1;

  // Volume state
  private volume: number = 0.5;

  // Previous volume state
  public previousVolume: number = 0.5; 
  
  // Subscriptions
  private subscription: Subscription;

  // Constructor with dependency injections
  constructor(
    private trackService: CurrentTrackService
  )
  {
    // Subscribe to volume changes
    this.subscription = this.trackService.volume$.subscribe((volume) => {
      // Update the volume
      this.value = volume;
    });
  }

  // Set the volume control
  volumeControl = new FormControl(this.value);

  // On component destroy
  ngOnDestroy() {
    // Unsubscribe from subscriptions
    this.subscription.unsubscribe();
  }

  private volumeTimeout: any = null;


  // Toggle mute
  toggleMute() {
    // Toggle mute state
    this.isMuted = !this.isMuted;
    // If muted...
    if (this.isMuted) {
      // Set the previousVolume to the current volume
      this.previousVolume = this.volume;
      // Set the volume to 0
      this.volume = 0;
      // Set the volume
      this.trackService.setVolume(this.volume);
    } else {
      // Otherwise, set the volume to the previous volume
      this.volume = this.previousVolume;
      // Set the volume
      this.trackService.setVolume(this.volume);
    }
  }
  

  // Set volume
  // Update volume when changed
  setVolume(event: any) {
    // Update volume on slider change
    this.volume = event.target.value;
    // unMute when slider is changed
    this.isMuted = false;
    // Set disabled to false
    this.disabled = false;
    // Update volume
    this.trackService.setVolume(this.volume);
  }
}