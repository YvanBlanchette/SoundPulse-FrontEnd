import { User, UserResponse } from '@/app/interfaces/user';
import { UserService } from '@/app/services/user.service';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { ProgressSpinnerComponent } from "@/app/components/_shared/progress-spinner/progress-spinner.component";
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterState } from '@angular/router';
import { RoutingService } from '@/app/services/routing.service';
import { ApiService } from '@/app/services/api.service';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { Track } from '@/app/interfaces/track';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { EditProfileFormComponent } from "../_dashboard/edit-profile-form/edit-profile-form.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    AsyncPipe,
    DatePipe,
    MatTableModule,
    MatMenuModule,
    NgFor,
    NgIf,
    NgClass,
    EditProfileFormComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardPage implements OnInit {
  user$!: Observable<User | null>;
  isLoading: boolean = true;
  isEditMode: boolean = false;
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
    private userService: UserService,
    private router: Router,
    public routingService: RoutingService,
    private apiService: ApiService,
    private currentTrackService: CurrentTrackService,
    private cdr: ChangeDetectorRef
  ) {
  }

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
    this.user$ = this.userService.getUser();
    this.getFavourites();
  }
  

  isSelected(track: Track): boolean {
    return this.currentTrackService?.isSelected(track);
  }

  // Function to fetch playlist details
  getFavourites(): void {
    this.apiService
      .fetchFormattedFavourites()
      .subscribe({
        next: (response) => {
          this.favourites = response;
          this.tracks = this.favourites;
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

   // Function to format tracks duration as MM:SS
   durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService?.selectTrack(track);
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

  onSelectItem(id: string, playlistId: string): void {
        this.router.navigate([`/albums/${id}`], { queryParams: { playlistId } });
  }

  artistProfile(id: string): void {
        this.router.navigate([`/artists/${id}`]);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
}