import { Component, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Component imports
import { MatProgressBar } from '@angular/material/progress-bar';
import { Track } from '@/app/interfaces/track';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatProgressBar],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
  
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  // Track data
  private _track: Track | null | undefined = undefined;

  // Input properties
  @Input() set track(value: Track | null | undefined) {
    // Update track data and reset audio
    this._track = value;
    this.resetAudio();
    this.updateAudioSource(value?.preview_url ?? '');
  }

  @Input() playbackStatus?: string;

  get track(): Track | null | undefined {
    return this._track;
  }

  // Audio element reference
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  // Playback state
  isPlaying = false;
  progress = 0;
  currentTime = 0;

  // Subscription for volume updates
  private volumeSubscription!: Subscription;

  constructor(private currentTrackService: CurrentTrackService) {}

  // Lifecycle hooks
  ngOnInit(): void {
    // Subscribe to volume updates
    this.volumeSubscription = this.currentTrackService.volume$.subscribe((volume) => {
      this.updateVolume(volume);
    });
  }

  ngAfterViewInit(): void {
    // Initialize audio event listeners
    this.initAudioEventListeners();

    // Set the audio source
    this.updateAudioSource(this.track?.preview_url ?? '');
  }

  ngOnDestroy(): void {
    // Unsubscribe from volume updates
    this.volumeSubscription.unsubscribe();
  }

  // Audio event listeners initialization
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

  // Methods
  /**
   * Toggle play/pause.
   */
  togglePlay(): void {
    try {
      const audio = this.audioRef.nativeElement;
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }

  /**
   * Reset audio playback.
   */
  resetAudio(): void {
    const audio = this.audioRef.nativeElement;
    audio.pause();
    audio.currentTime = 0;
    this.isPlaying = false;
    this.progress = 0;
  }

  /**
   * Seek to a specific time.
   * @param event MouseEvent
   */
  seek(event: MouseEvent): void {
    const progressBar = event.target as HTMLElement;
    const clickPosition = event.offsetX;
    const totalWidth = progressBar.clientWidth;
    const clickRatio = clickPosition / totalWidth;
    const audio = this.audioRef.nativeElement;
    audio.currentTime = clickRatio * audio.duration;
    this.updateProgress();
  }

  /**
   * Update progress.
   */
  updateProgress(): void {
    const audio = this.audioRef.nativeElement;
    if (audio) {
      this.progress = (audio.currentTime / audio.duration) * 100;
      this.currentTime = audio.currentTime;
    }
  }

  /**
   * Format time as MM:SS.
   * @param inputSeconds number
   * @returns string
   */
  formatTime(inputSeconds: number): string {
    const date = new Date(inputSeconds * 1000);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Update audio source.
   * @param src string
   */
  private updateAudioSource(src: string | null | undefined): void {
    const audio = this.audioRef.nativeElement;
    if (audio) {
      audio.src = src ?? '';
    }
  }


   /**
   * Update volume.
   * @param volume number
   */
   private updateVolume(volume: number): void {
    const audio = this.audioRef.nativeElement;
    if (audio) {
      audio.volume = volume;
    }
  }
}