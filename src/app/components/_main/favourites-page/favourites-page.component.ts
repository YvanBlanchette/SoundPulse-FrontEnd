import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

//* Interface imports
import { Track } from '@/app/interfaces/track';
import { PlaylistResponse } from '@/app/interfaces/playlist-response';


//* Service imports
import { ApiService } from '@/app/services/api.service';
import { CurrentTrackService } from '@/app/services/current-track.service';


//* Component imports
import { MatMenuModule } from '@angular/material/menu';
import { ProgressSpinnerComponent } from '../../_shared/progress-spinner/progress-spinner.component';
import { RoutingService } from '@/app/services/routing.service';
import { FavouritesService } from '@/app/services/favourites.service';
import { FavouritesButtonComponent } from "../../_shared/favourites-button/favourites-button.component";


@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [
    MatTableModule,
    ProgressSpinnerComponent,
    MatMenuModule,
    NgFor,
    NgIf,
    FavouritesButtonComponent
],
  templateUrl: './favourites-page.component.html',
  styleUrl: './favourites-page.component.css'
})


export class FavouritesPage implements OnInit {
  // Properties
  playlistName: string = 'Vos Chansons favourites';
  playlistId: string = '';
  playlistBackground: string = 'https://images.unsplash.com/photo-1675544050566-c4be432d0418?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  isLoading: boolean = true;
  error: any = null;
  tracks: any | null | undefined = null;
  displayedColumns: string[] = [
    'index',
    'title',
    'artist',
    'duration',
    'options',
  ];

  constructor(
    private router: Router,
    public routingService: RoutingService,
    public favouritesService: FavouritesService,
    private currentTrackService: CurrentTrackService,
    private cdr: ChangeDetectorRef
  ) {}
  
  private _favourites: any | null | undefined = null;

  
  @Input()
  set favourites(value: any | null | undefined) {
    this._favourites = value;
    this.cdr.detectChanges();
  }
  

  get favourites(): any | null | undefined {
    return this._favourites;
  }


  ngOnInit(): void {
        this.getFavouriteSongs();
  }


  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  //! Function to fetch playlist details
  getFavouriteSongs(): void {
    this.favouritesService.getFavouriteTracks().subscribe({
      next: (favouriteTracks) => {
        this.favourites = favouriteTracks;
        this.tracks = favouriteTracks;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching playlist details: ', error);
        this.error = error;
        this.isLoading = false;
      },
    });
  }


   //! Function to format tracks duration as MM:SS
   durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  //! Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService?.selectTrack(track);
  }

  onSelectItem(id: string, playlistId: string): void {
        this.router.navigate([`/albums/${id}`], { queryParams: { playlistId } });
  }

  artistProfile(id: string): void {
        this.router.navigate([`/artists/${id}`]);
  }
}
