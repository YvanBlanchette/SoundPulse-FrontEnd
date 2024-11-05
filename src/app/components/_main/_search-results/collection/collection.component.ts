import { SearchResults } from '@/app/interfaces/search-results';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent {
  @Input() collection: any | null = null;
  
  constructor(private router: Router) {}

  onItemClick(item: any): void {
    console.log(item);
    if (item.type === 'album') {
      const artistId = item.artists[0].id;
      this.router.navigate(['/albums', item.id], { queryParams: { artistId } });
    } else if(item.type === 'playlist') {
      this.router.navigate(['/playlists', item.id]);
    } else if (item.type === 'artist') {
      this.router.navigate(['/artists', item.id]);
    }
  }
}
