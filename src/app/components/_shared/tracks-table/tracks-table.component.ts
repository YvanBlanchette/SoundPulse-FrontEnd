import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { FavouritesButtonComponent } from "@/app/components/_shared/favourites-button/favourites-button.component";

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Service imports
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Pipe imports
import { FormatSongDurationPipe } from '@/app/pipes/format-song-duration.pipe';

@Component({
  selector: 'app-tracks-table',
  standalone: true,
  imports: [
    FavouritesButtonComponent,
    MatTableModule,
    MatMenuModule,
    NgFor,
    NgIf,
    FormatSongDurationPipe
  ],
  templateUrl: './tracks-table.component.html',
  styleUrl: './tracks-table.component.css'
})


export class TracksTableComponent {
  @Input() tracks: any;
  displayedColumns: string[] = [
    'index',
    'thumbnail',
    'title',
    'artist',
    'duration',
    'options',
  ];

  // Constructor with dependency injections
  constructor(
    public routingService: RoutingService,
    private currentTrackService: CurrentTrackService,
    public libraryService: LibraryService,
  ) {}


  // Function to navigate to the track's page
  navigateToTrack(track: Track) {
    this.currentTrackService?.selectTrack(track);
    this.routingService.navigateTo(this.routingService.Categories.track, track.id);
  }

  
  // Function to check if a track is selected
  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }


  // Function to handle track click
  onTrackClick(track: Track): void {
      this.currentTrackService?.selectTrack(track);
  }
}
