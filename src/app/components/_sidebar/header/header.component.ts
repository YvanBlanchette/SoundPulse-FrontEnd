import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

//* Component imports
import { MatIcon } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

//* Service imports
import { RoutingService } from '@/app/services/routing.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatChipsModule, NgClass, MatTooltipModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class HeaderComponent {
  // Outputs
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<string>();

  currentFilter: string = 'all';


  // Constructor with dependency injection
  constructor(public routingService: RoutingService) { }

  // Function to handle filter changes
  onFilterChange(filter: string) {
    this.currentFilter = filter;
    this.filterChange.emit(filter);
  }

  // Functioon to toggle sidenav
  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
