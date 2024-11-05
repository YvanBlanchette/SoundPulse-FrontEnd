import { Routes } from '@angular/router';
import { WelcomePageComponent } from '@/app/components/_main/welcome-page/welcome-page.component';
import { SearchResultsPage } from '@/app/components/_main/search-results-page/search-results-page.component';
import { AlbumPage } from '@/app/components/_main/album-page/album-page.component';
import { ArtistPage } from '@/app/components/_main/artist-page/artist-page.component';
import { PlaylistPage } from '@/app/components/_main/playlist-page/playlist-page.component';
import { FavouritesPage } from './components/_main/favourites-page/favourites-page.component';
import { TrackPage } from './components/_main/track-page/track-page.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'artists/:id',
    component: ArtistPage
  },
  {
    path: 'albums/:id',
    component: AlbumPage
  },
  {
    path: 'tracks/:id',
    component: TrackPage
  },
  {
    path: 'playlists/:id',
    component: PlaylistPage
  },
  {
    path: 'favourites',
    component: FavouritesPage
  },
  {
    path: 'search',
    component: SearchResultsPage
  },
];