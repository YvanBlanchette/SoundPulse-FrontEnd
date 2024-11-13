import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
  @Input() itemDetails: any;

  constructor(
    public libraryService: LibraryService,
    public routingService: RoutingService,
  ) { }

}
