//* Module imports
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  // Outputs
  @Output() toggleSidenav = new EventEmitter<void>();

  // Methods
  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
