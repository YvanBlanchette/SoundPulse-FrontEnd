import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

//* Service imports
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';
import { FormatNumbersPipe } from '@/app/pipes/format-numbers.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrentTrackService } from '@/app/services/current-track.service';
import { FavouritesService } from '@/app/services/favourites.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [AsyncPipe, DatePipe, FormatNumbersPipe, MatTooltipModule],
  templateUrl: './page-header.component.html',
})
  
export class PageHeaderComponent {
  @Input() itemDetails: any;

  // Constructor with dependencie injections
  constructor(
    public libraryService: LibraryService,
    public routingService: RoutingService,
    public favouritesService: FavouritesService,
    public currentTrackService: CurrentTrackService
  ) { }

}
