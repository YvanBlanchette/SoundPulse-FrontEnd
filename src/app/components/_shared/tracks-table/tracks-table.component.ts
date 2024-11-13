import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FavouritesButtonComponent } from "../favourites-button/favourites-button.component";
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { RoutingService } from '@/app/services/routing.service';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { LibraryService } from '@/app/services/library.service';
import { Track } from '@/app/interfaces/track';

@Component({
  selector: 'app-tracks-table',
  standalone: true,
  imports: [
    FavouritesButtonComponent,
    MatTableModule,
    MatMenuModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './tracks-table.component.html',
  styleUrl: './tracks-table.component.css'
})
export class TracksTableComponent {
  @Input() tracks: Track[] = [];
  displayedColumns: string[] = [
    'index',
    'thumbnail',
    'title',
    'artist',
    'duration',
    'options',
  ];

  constructor(
    private router: Router,
    public routingService: RoutingService,
    private currentTrackService: CurrentTrackService,
    public libraryService: LibraryService,
  ) {}



  //! Function to format tracks duration as MM:SS
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }


  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }


  //! Function to handle track click
  onTrackClick(track: Track): void {
      console.log(track)
      this.currentTrackService?.selectTrack(track);
  }

  onSelectItem(id: string, artistId: string): void {
    this.router.navigate([`/albums/${id}`], { queryParams: { artistId } });
  }

  artistProfile(id: string): void {
    this.router.navigate([`/artists/${id}`]);
  }

}
