// sidebar.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from "@/app/components/_sidebar/header/header.component";
import { LibraryComponent } from "@/app/components/_sidebar/library/library.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HeaderComponent, LibraryComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
}