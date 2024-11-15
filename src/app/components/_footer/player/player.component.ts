import { AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

//* Component imports
import { MatProgressBar } from '@angular/material/progress-bar';

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Pipe imports
import { FormatDurationPipe } from '@/app/pipes/format-duration.pipe';


@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatProgressBar, FormatDurationPipe],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})

  
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  // Audio element reference
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  // Flag to set if there is a preview URL
  public hasPreviewUrl = false;

  // Playback properties
  isPlaying = false;
  progress = 0;
  currentTime = 0;

  // Audio properties
  public audioDuration = 0;

  // Sanitized preview URL
  sanitizedUrl!: any;

  // Subscriptions
  private volumeSubscription!: Subscription;
  private trackSubscription!: Subscription;

  constructor(public currentTrackService: CurrentTrackService, private sanitizer: DomSanitizer) {
    this.currentTrack$ = this.currentTrackService.currentTrack$;
  }

  // Current track observable
  public currentTrack$: Observable<Track | null>;

  // Initialize subscriptions
  ngOnInit(): void {
    this.initSubscriptions();
  }

  // Initialize audio event listeners
  ngAfterViewInit(): void {
    this.initAudioEventListeners();
    const audio = this.audioRef.nativeElement;
    if (audio) {
    // Get audio duration on load
    audio.addEventListener('loadedmetadata', () => {
      this.audioDuration = audio.duration;
    });
  }
  }

  // Unsubscribe from subscriptions
  ngOnDestroy(): void {
    this.volumeSubscription.unsubscribe();
    this.trackSubscription.unsubscribe();
  }

  // Subscriptions initialization
  private initSubscriptions(): void {
    // Subscribe to volume updates
    this.volumeSubscription = this.currentTrackService.volume$.subscribe((volume) => {
      this.updateVolume(volume);
    });

    // Subscribe to track updates
    this.trackSubscription = this.currentTrackService.currentTrack$.subscribe((track) => {
      // Update preview URL flag and audio source
      if (track && track.preview_url) {
        // Set the hasPreviewUrl flag to true
        this.hasPreviewUrl = true;
        // Sanitize the preview URL to prevent security issues
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(track.preview_url);
        // Update the audio source
        this.updateAudioSource(track.preview_url);
      } else {
        // Set the hasPreviewUrl flag to false
        this.hasPreviewUrl = false;
        // Reset audio
        this.resetAudio();
      }
    });
  }

  // Method to get play button disabled state when there is no preview URL
  public get isPlayButtonDisabled(): boolean {
    return !this.hasPreviewUrl;
  }

  // Method to initialize Audio event listeners
  private initAudioEventListeners(): void {
    const audio = this.audioRef.nativeElement;

    if (audio) {
      // Time update event
      audio.addEventListener('timeupdate', () => {
        this.updateProgress();
      });

      // Play event
      audio.addEventListener('play', () => {
        this.isPlaying = true;
      });

      // Pause event
      audio.addEventListener('pause', () => {
        this.isPlaying = false;
      });

      // End event
      audio.addEventListener('ended', () => {
        this.resetAudio();
      });

      // Error event
      audio.addEventListener('error', (error) => {
        console.error('Audio error:', error);
      });
    }
  }

  // Method to toggle play/pause
  async togglePlay(): Promise<void> {
    try {
      const audio = this.audioRef.nativeElement;

      // If the audio is paused or ended
      if (audio.paused || audio.ended) {
        // Play the audio
        await audio.play();
      } else {
        // Pause the audio
        audio.pause();
      }
    } catch (error) {
      // Log the error
      console.error('Error toggling playback:', error);
    }
  }

  // Method to reset the audio
  resetAudio(): void {
    const audio = this.audioRef.nativeElement;
    // Pause the audio
    audio.pause();
    // Set the time to 0
    audio.currentTime = 0;
    // Change the isPlaying flag to false
    this.isPlaying = false;
    // Set the progress to 0
    this.progress = 0;
  }

  // Method to seek to a specific time
  seek(event: MouseEvent): void {
    // Seek to specific time
    const progressBar = event.target as HTMLElement;
    const clickPosition = event.offsetX;
    const totalWidth = progressBar.clientWidth;
    const clickRatio = clickPosition / totalWidth;
    const audio = this.audioRef.nativeElement;
    audio.currentTime = clickRatio * audio.duration;
    this.updateProgress();
  }

  // Method to update the progress bar
  updateProgress(): void {
    const audio = this.audioRef.nativeElement;
    if (audio && audio.duration !== Infinity && !Number.isNaN(audio.duration)) {
      // Update progress bar
      this.progress = (audio.currentTime / audio.duration) * 100;
      this.currentTime = audio.currentTime;
    }
  }


  // Method to update the audio source
  private updateAudioSource(src: string | null | undefined): void {
    // Reset audio before updating source
    this.resetAudio();
    if (src) {
      const audio = this.audioRef.nativeElement;
      if (audio) {
        // Update audio source
        audio.src = src;
        // Load audio
        audio.load();
      }
    }
  }

  // Method to update the volume
  private updateVolume(volume: number): void {
    const audio = this.audioRef.nativeElement;
    if (audio) {
      // Update audio volume
      audio.volume = volume;
    }
  }
}