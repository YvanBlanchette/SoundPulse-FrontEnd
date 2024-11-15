import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

//* Component imports
import { CollectionComponent } from "@/app/components/_shared/collection/collection.component";
import { TracksTableComponent } from "@/app/components/_shared/tracks-table/tracks-table.component";
import { ProgressSpinnerComponent } from "@/app/components/_shared/progress-spinner/progress-spinner.component";
import { EditProfileFormComponent } from "@/app/components/_main/_dashboard/edit-profile-form/edit-profile-form.component";

//* Interface imports
import { User } from '@/app/interfaces/user';
import { Track } from '@/app/interfaces/track';
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { UserService } from '@/app/services/user.service';
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';
import { FavouritesService } from '@/app/services/favourites.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@/app/services/auth.service';


enum LibraryItemType {
  Artist = 'Artist',
  Album = 'Album',
  Playlist = 'Playlist',
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    AsyncPipe,
    DatePipe,
    MatMenuModule,
    MatIconModule,
    EditProfileFormComponent,
    TracksTableComponent,
    CollectionComponent
  ],
  templateUrl: './dashboard.component.html',
})


export class DashboardPage implements OnInit {
  // User observable
  user$!: Observable<User | null>;
  // Loading state
  isLoading: boolean = true;
  // Edit mode
  isEditMode: boolean = false;
  // Error messages
  error: any = null;

  // Variables
  tracks: Track[] = [];
  libraryItems: LibraryItem[] = [];
  artists: LibraryItem[] = [];
  albums: LibraryItem[] = [];
  playlists: LibraryItem[] = [];


  // Constructor with dependency injections
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    public routingService: RoutingService,
    public favouritesService: FavouritesService,
    public libraryService: LibraryService,
    private cdr: ChangeDetectorRef
  ) { }


  // On Initialize component
  ngOnInit(): void {
    this.user$ = this.userService.getUser();
    this.getFavouriteSongs();
    this.getLibraryItems();
  }


  // Get library items
  getLibraryItems(): void {
    this.libraryService.getLibraryItems().pipe(
      tap((libraryItems) => {
        this.libraryItems = libraryItems;
        this.filterLibraryItems();
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching library items: ', error);
        this.error = error;
        this.isLoading = false;
      },
    });
  }


  // Filter library items by type
  filterLibraryItems() {
    this.artists = this.libraryItems.filter((item) => item.type === LibraryItemType.Artist);
    this.albums = this.libraryItems.filter((item) => item.type === LibraryItemType.Album);
    this.playlists = this.libraryItems.filter((item) => item.type === LibraryItemType.Playlist);
    console.log(this.artists, this.albums, this.playlists);
  }


  // Fetch playlist details
  getFavouriteSongs(): void {
    this.favouritesService.getFavouriteTracks().subscribe({
      next: (favouriteTracks) => {
        this.tracks = favouriteTracks;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching favourite tracks: ', error);
        this.error = error;
        this.isLoading = false;
      },
    });
  }


  // Function to navigate to album page
  onSelectItem(id: string, playlistId: string): void {
    this.router.navigate([`/albums/${id}`], { queryParams: { playlistId } });
  }


  // Function to toggle edit mode
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }


  // Function to delete account
  deleteAccount() {
    // Ask for confirmation
    if (confirm("Êtes-vous certain de vouloir supprimer votre compte ?")) {
      // Delete account using the UserService
      this.userService.deleteUser()
      .subscribe({
        error: (error) => {
          // Log the error
          console.error('Une erreur s\'est produite lors de la suppression du compte: ', error);
        }
      });
    }
  }
}