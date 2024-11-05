import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { register } from 'swiper/element/bundle';

import { routes } from './app/app.routes';

//* Component imports
import { AppComponent } from './app/app.component';

//* Service imports
import { ApiService } from './app/services/api.service';

// register Swiper custom elements
register();

// Angular application bootstrap
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(), 
    ApiService,
    provideRouter(routes)
  ]
}).catch(err => console.error(err));