// sidebar.component.ts
import { Component, Input } from '@angular/core';

//* Component imports
import { HeaderComponent } from "@/app/components/_sidebar/header/header.component";
import { LibraryComponent } from "@/app/components/_sidebar/library/library.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HeaderComponent, LibraryComponent,
  ],
  templateUrl: './sidebar.component.html',
})


export class SidebarComponent {
  // Variables
  @Input() filter: string = 'all';


  // Function to handle filter changes
  onFilterChange(filter: string) {
    this.filter = filter;
  }
}