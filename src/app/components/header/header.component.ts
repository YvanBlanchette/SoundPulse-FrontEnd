import { Component } from '@angular/core';

//* Component imports
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from "@/app/components/_shared/logo/logo.component";
import { SearchComponent } from "@/app/components/_header/search/search.component";
import { UserButtonComponent } from "@/app/components/_header/user-button/user-button.component";

//* Service imports
import { RoutingService } from '@/app/services/routing.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    SearchComponent,
    UserButtonComponent,
    MatIconModule
  ],
  templateUrl: './header.component.html',
})
  
export class HeaderComponent {

  // Constructor with dependencie injections
  constructor(public routingService: RoutingService) {}

}