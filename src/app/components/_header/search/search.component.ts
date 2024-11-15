//* Module imports
import { Component, OnDestroy, OnInit } from '@angular/core';

//* Component imports
import { MatInput } from '@angular/material/input';

//* Service imports
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatInput],
  templateUrl: './search.component.html',
})
export class SearchComponent {

  // Constructor with dependency injections
  constructor(private router: Router) { }

  // Method to submit the search query to the Api
  onSubmit(query: string): void {
    // Check if the query is not empty
    if (query.trim() !== '') {
      // Navigate to the search results page with the query as a parameter
      this.router.navigate(['/search'], { queryParams: { q: query } });
    } else {
      // Log an error message
      console.error('Vous devez entrer une recherche');
    }
  }
}