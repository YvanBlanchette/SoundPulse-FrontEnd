//* Module imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

//* Component imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

//* Service imports
import { SearchResultStoreService } from '@/app/services/search-results-store.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatFormFieldModule, MatIcon, MatInput],
  templateUrl: './search.component.html',
})
export class SearchComponent {

  constructor(private router: Router) { }

  onSubmit(query: string): void {
    if (query.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    } else {
      console.error('Search query cannot be empty');
    }
  }
}