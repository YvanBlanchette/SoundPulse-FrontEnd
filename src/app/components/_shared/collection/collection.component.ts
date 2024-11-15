import { RoutingService } from '@/app/services/routing.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [],
  templateUrl: './collection.component.html',
})
export class CollectionComponent {
  @Input() collection: any;
  
  constructor(public routingService: RoutingService) {}
}
