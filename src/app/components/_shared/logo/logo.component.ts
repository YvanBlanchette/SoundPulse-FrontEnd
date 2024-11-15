import { RoutingService } from '@/app/services/routing.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html'
})
export class LogoComponent {

  // Constructor with dependency injection
  constructor(public routingService: RoutingService) {}
}
