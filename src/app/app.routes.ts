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
import { TrackPage } from '@/app/components/_main/track-page/track-page.component';
import { DashboardPage } from '@/app/components/_main/dashboard-page/dashboard.component';

export const routes: Routes = [
  {
    // Auth layout route
    path: 'auth',
    component: AuthLayout,
    canActivate: [AuthGuard],
  },
  {
    // Main layout route
    path: '',
    canActivate: [AuthGuard],
    component: MainLayout,
    children: [
      {
        // Default route
        path: '',
        component: WelcomePageComponent
      },
      {
        // Artist route
        path: 'artists/:id',
        component: ArtistPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        // Album route
        path: 'albums/:id',
        component: AlbumPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        // Track route
        path: 'tracks/:id',
        component: TrackPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        // Playlist route
        path: 'playlists/:id',
        component: PlaylistPage,
        runGuardsAndResolvers: 'paramsChange'
      },
      {
        // Search route
        path: 'search',
        component: SearchResultsPage
      },
      {
        // Dashboard route
        path: 'dashboard',
        component: DashboardPage
      },
    ]
  },
];