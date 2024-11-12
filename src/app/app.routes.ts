import { Routes } from '@angular/router';
import { AuthGuard } from '@/app/auth.guard';

//* Layouts
import { AuthLayout } from '@/app/layouts/auth-layout/auth-layout.component';
import { MainLayout } from '@/app/layouts/main-layout/main-layout.component';

//* Components
import { WelcomePageComponent } from '@/app/components/_main/welcome-page/welcome-page.component';
import { SearchResultsPage } from '@/app/components/_main/search-results-page/search-results-page.component';
import { AlbumPage } from '@/app/components/_main/album-page/album-page.component';
import { ArtistPage } from '@/app/components/_main/artist-page/artist-page.component';
import { PlaylistPage } from '@/app/components/_main/playlist-page/playlist-page.component';
import { FavouritesPage } from '@/app/components/_main/favourites-page/favourites-page.component';
import { TrackPage } from '@/app/components/_main/track-page/track-page.component';
import { DashboardPage } from '@/app/components/_main/dashboard-page/dashboard.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayout,
    children: [
      {
        path: '',
        component: WelcomePageComponent
      },
      {
        path: 'artists/:id',
        component: ArtistPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        path: 'albums/:id',
        component: AlbumPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        path: 'tracks/:id',
        component: TrackPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        path: 'playlists/:id',
        component: PlaylistPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        path: 'favourites',
        component: FavouritesPage
      },
      {
        path: 'search',
        component: SearchResultsPage
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
    ]
  },
];