import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

//* Service imports
import { ApiService } from '@/app/services/api.service';
import { RoutingService } from '@/app/services/routing.service';
import { FavouritesService } from '@/app/services/favourites.service';
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Interface imports
import { Track } from '@/app/interfaces/track';

//* Component imports
import { ProgressSpinnerComponent } from '@/app/components/_shared/progress-spinner/progress-spinner.component';
import { FavouritesButtonComponent } from "@/app/components/_shared/favourites-button/favourites-button.component";

@Component({
  selector: 'app-tracks-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatMenuModule,
    NgIf,
    FavouritesButtonComponent
],
  templateUrl: './tracks-table.component.html',
  styleUrls: ['./tracks-table.component.css']
})
export class TracksTableComponent implements OnInit, OnDestroy {
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
    public favouritesService: FavouritesService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  //! Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService?.selectTrack(track);
  }

  //! Function to format tracks duration as MM:SS
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  //! Function to add a song to favourites
  public addFavouriteSong(track: Track): void {
    this.favouritesService.addFavourite(track);
  }

  //! Function to remove a song to favourites
  removeFavourite(track: Track): void {
    this.favouritesService.removeFavourite(track);
  }

  //! Function to check if a track is a favourite
  isItemInFavourite(track: Track): Observable<boolean> {
    return this.favouritesService.isFavourite(track);
  }

  artistProfile(id: string): void {
    this.router.navigate([`/artists/${id}`]);
  }
}