import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

//* Component imports
import { AppComponent } from './app/app.component';

//* Service imports
import { ApiService } from './app/services/api-service.service';
import { ArtistDetailsStoreService } from './app/services/stores/artist-details-store.service';

// Angular application bootstrap
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(), 
    ApiService,
    ArtistDetailsStoreService
  ]
}).catch(err => console.error(err));