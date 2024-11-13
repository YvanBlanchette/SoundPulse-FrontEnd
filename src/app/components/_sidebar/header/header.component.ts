//* Module imports
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatChipsModule, NgClass, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // Outputs
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<string>();
  currentFilter: string = 'all';

  onFilterChange(filter: string) {
    this.currentFilter = filter;
    this.filterChange.emit(filter);
  }

  // Methods
  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
