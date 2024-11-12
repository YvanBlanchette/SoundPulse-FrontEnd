import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';
import { Track } from '@/app/interfaces/track';
import { ApiService } from '@/app/services/api.service';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { RoutingService } from '@/app/services/routing.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracks-table',
  standalone: true,
  imports: [    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgForOf,
    NgIf,
    NgClass],
  templateUrl: './tracks-table.component.html',
  styleUrl: './tracks-table.component.css'
})
export class TracksTableComponent {
  @Input() dataSource: any;
  displayedColumns:any = [
    'index',
    'thumbnail',
    'title',
    'artist',
    'duration',
    'options',
  ];

  
  constructor(
    public currentTrackService: CurrentTrackService,
    public routingService: RoutingService,
    private apiService: ApiService,
    private router: Router
  ) { }

    // Function to handle track click
    onTrackClick(track: Track): void {
      this.currentTrackService?.selectTrack(track);
  }
  
  // Function to format tracks duration as MM:SS
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Function to toggle favourites
  public toggleFavourite(track: Track) {
    this.apiService.toggleFavourite(track).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error toggling favourite:', error);
      },
    );
  }

  // Function to check if a track is a favourite
  isFavourite(track: Track): boolean {
    return this.apiService.isFavourite(track);
  }

  artistProfile(id: string): void {
    this.router.navigate([`/artists/${id}`]);
  }
}
